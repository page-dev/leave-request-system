<?php

use App\Models\AuditLog;
use App\Models\LeaveRequest;
use App\Models\LeaveSetting;
use App\Models\LeaveType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('administrators can select which weekdays count toward leave', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    $employee = User::factory()->create();
    $leaveType = LeaveType::factory()->create();

    $this->actingAs($administrator)
        ->patch(route('admin.settings.update'), [
            'counted_weekdays' => [1, 2, 3, 4],
            'minimum_notice_days' => 3,
            'enforce_leave_limits' => true,
        ])
        ->assertRedirect(route('admin.settings.general'))
        ->assertInertiaFlash('toast.message', 'Leave settings updated.');

    $this->assertDatabaseHas('leave_settings', [
        'id' => 1,
        'enforce_leave_limits' => true,
    ]);

    $auditLog = AuditLog::query()->sole();

    expect($auditLog->action)->toBe('leave_settings.updated')
        ->and($auditLog->user_id)->toBe($administrator->id)
        ->and($auditLog->subject_type)->toBe(LeaveSetting::class)
        ->and($auditLog->new_values)->toBe([
            'counted_weekdays' => [1, 2, 3, 4],
            'minimum_notice_days' => 3,
            'enforce_leave_limits' => true,
        ]);

    $leaveRequest = LeaveRequest::factory()
        ->for($employee)
        ->for($leaveType)
        ->create([
            'start_date' => '2026-09-10',
            'end_date' => '2026-09-14',
        ]);

    $this->actingAs($employee)
        ->get(route('leave-requests.index'))
        ->assertInertia(fn ($page) => $page
            ->where('leaveRequests.0.id', $leaveRequest->id)
            ->where('leaveRequests.0.days', 2),
        );
});

test('employees cannot change counted leave weekdays', function () {
    $employee = User::factory()->create();

    $this->actingAs($employee)
        ->patch(route('admin.settings.update'), [
            'counted_weekdays' => [1, 2, 3, 4],
            'minimum_notice_days' => 3,
            'enforce_leave_limits' => true,
        ])
        ->assertForbidden();

    expect(LeaveSetting::query()->exists())->toBeFalse();
});

test('updating existing leave settings records only changed values', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    LeaveSetting::factory()->create([
        'counted_weekdays' => [1, 2, 3, 4, 5],
        'minimum_notice_days' => 3,
        'enforce_leave_limits' => false,
    ]);

    $this->actingAs($administrator)
        ->patch(route('admin.settings.update'), [
            'counted_weekdays' => [1, 2, 3, 4, 5],
            'minimum_notice_days' => 5,
            'enforce_leave_limits' => false,
        ])
        ->assertRedirect(route('admin.settings.general'));

    $auditLog = AuditLog::query()->sole();

    expect($auditLog->old_values)->toBe(['minimum_notice_days' => 3])
        ->and($auditLog->new_values)->toBe(['minimum_notice_days' => 5]);
});

test('counted weekdays require at least one selected day', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);

    $this->actingAs($administrator)
        ->from(route('admin.settings.general'))
        ->patch(route('admin.settings.update'), [
            'counted_weekdays' => [],
            'minimum_notice_days' => 3,
            'enforce_leave_limits' => false,
        ])
        ->assertRedirect(route('admin.settings.general'))
        ->assertSessionHasErrors('counted_weekdays');
});
