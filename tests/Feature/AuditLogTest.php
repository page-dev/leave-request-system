<?php

use App\Models\AuditLog;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('administrators can access the audit log page', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    $auditLog = AuditLog::factory()->for($administrator)->create();

    $this->actingAs($administrator)
        ->get(route('admin.audit-logs.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/audit-logs/index')
            ->where('auditLogs.data.0.id', $auditLog->id),
        );
});

test('paginates audit logs in groups of twenty', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);

    AuditLog::factory()->count(21)->for($administrator)->create();

    $this->actingAs($administrator)
        ->get(route('admin.audit-logs.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/audit-logs/index')
            ->has('auditLogs.data', 20)
            ->where('auditLogs.current_page', 1)
            ->where('auditLogs.last_page', 2)
            ->where('auditLogs.total', 21),
        );
});

test('employees cannot access the audit log page', function () {
    $employee = User::factory()->create();

    $this->actingAs($employee)
        ->get(route('admin.audit-logs.index'))
        ->assertForbidden();
});

test('approving a leave request records an audit entry', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    $leaveRequest = LeaveRequest::factory()
        ->for(User::factory())
        ->for(LeaveType::factory())
        ->create(['status' => 'pending']);

    $this->actingAs($administrator)
        ->post(route('admin.leave-requests.approve', $leaveRequest), ['review_note' => 'Approved.'])
        ->assertRedirect(route('admin.leave-requests.index'));

    $leaveRequest->refresh();
    $auditLog = AuditLog::query()->sole();

    expect($leaveRequest->status)->toBe('approved')
        ->and($leaveRequest->reviewed_by)->toBe($administrator->id)
        ->and($leaveRequest->reviewed_at)->not->toBeNull()
        ->and($auditLog->action)->toBe('leave_request.approved')
        ->and($auditLog->user_id)->toBe($administrator->id)
        ->and($auditLog->subject_type)->toBe(LeaveRequest::class)
        ->and($auditLog->subject_id)->toBe($leaveRequest->id)
        ->and($auditLog->old_values['status'])->toBe('pending')
        ->and($auditLog->new_values['status'])->toBe('approved');
});

test('rejecting a leave request records an audit entry', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    $leaveRequest = LeaveRequest::factory()
        ->for(User::factory())
        ->for(LeaveType::factory())
        ->create(['status' => 'pending']);

    $this->actingAs($administrator)
        ->post(route('admin.leave-requests.reject', $leaveRequest), ['review_note' => 'Insufficient notice.'])
        ->assertRedirect(route('admin.leave-requests.index'));

    expect(AuditLog::query()->sole()->action)->toBe('leave_request.rejected');
});

test('updating a leave type records only the changed values', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    $leaveType = LeaveType::factory()->create(['day_limit' => 10]);

    $this->actingAs($administrator)
        ->put(route('admin.leave-types.update', $leaveType), [
            'name' => $leaveType->name,
            'description' => $leaveType->description,
            'day_limit' => 15,
        ])
        ->assertRedirect(route('admin.leave-types.index'));

    $auditLog = AuditLog::query()->sole();

    expect($auditLog->action)->toBe('leave_type.updated')
        ->and($auditLog->old_values)->toBe(['day_limit' => 10])
        ->and($auditLog->new_values)->toBe(['day_limit' => 15]);
});

test('user changes are audited without storing password values', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    $user = User::factory()->create(['role' => 'employee']);

    $this->actingAs($administrator)
        ->put(route('admin.users.update', $user), [
            'first_name' => 'Updated',
            'last_name' => $user->last_name,
            'email' => $user->email,
            'role' => 'administrator',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->assertRedirect();

    $auditLogs = AuditLog::query()->orderBy('action')->get();
    $roleChange = $auditLogs->firstWhere('action', 'user.role_changed');
    $passwordReset = $auditLogs->firstWhere('action', 'user.password_reset');

    expect($roleChange?->old_values)->toBe(['role' => 'employee'])
        ->and($roleChange?->new_values)->toBe(['role' => 'administrator'])
        ->and($passwordReset?->old_values)->toBeNull()
        ->and($passwordReset?->new_values)->toBeNull()
        ->and($auditLogs->contains(fn (AuditLog $auditLog): bool => array_key_exists('password', $auditLog->old_values ?? [])))->toBeFalse()
        ->and($auditLogs->contains(fn (AuditLog $auditLog): bool => array_key_exists('password', $auditLog->new_values ?? [])))->toBeFalse();
});

test('activating and deactivating users creates the corresponding audit entries', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    $employee = User::factory()->create(['is_active' => false]);

    $this->actingAs($administrator)
        ->patch(route('admin.users.toggle-activation', $employee))
        ->assertRedirect();
    $this->actingAs($administrator)
        ->patch(route('admin.users.toggle-activation', $employee))
        ->assertRedirect();

    expect(AuditLog::query()->pluck('action')->all())
        ->toBe(['user.activated', 'user.deactivated']);
});

test('a failed review does not create an audit entry', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    $leaveRequest = LeaveRequest::factory()
        ->for(User::factory())
        ->for(LeaveType::factory())
        ->create(['status' => 'approved']);

    $this->actingAs($administrator)
        ->post(route('admin.leave-requests.reject', $leaveRequest))
        ->assertRedirect();

    $this->assertDatabaseCount('audit_logs', 0);
});

test('audit log filters match actions administrators and search terms', function () {
    $administrator = User::factory()->create([
        'role' => 'administrator',
        'email' => 'auditor@example.test',
    ]);
    $otherAdministrator = User::factory()->create(['role' => 'administrator']);
    $matchingLog = AuditLog::factory()
        ->for($administrator)
        ->create([
            'action' => 'leave_type.updated',
            'description' => 'Updated Vacation Leave.',
        ]);
    AuditLog::factory()->for($otherAdministrator)->create([
        'action' => 'user.deactivated',
    ]);

    $this->actingAs($administrator)
        ->get(route('admin.audit-logs.index', [
            'search' => 'Vacation',
            'action' => 'leave_type.updated',
            'user_id' => $administrator->id,
        ]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/audit-logs/index')
            ->has('auditLogs.data', 1)
            ->where('auditLogs.data.0.id', $matchingLog->id)
            ->where('filters.search', 'Vacation')
            ->where('filters.action', 'leave_type.updated')
            ->where('filters.user_id', $administrator->id),
        );
});
