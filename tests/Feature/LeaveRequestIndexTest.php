<?php

use App\Models\LeaveRequest;
use App\Models\LeaveSetting;
use App\Models\LeaveType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('renders the inclusive day count for each leave request', function () {
    $employee = User::factory()->create();
    $leaveType = LeaveType::factory()->create();
    $leaveRequest = LeaveRequest::factory()
        ->for($employee)
        ->for($leaveType)
        ->create([
            'start_date' => '2026-09-10',
            'end_date' => '2026-09-14',
        ]);

    $this->actingAs($employee)
        ->get(route('leave-requests.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('leave-requests/index')
            ->where('leaveRequests.0.id', $leaveRequest->id)
            ->where('leaveRequests.0.days', 5),
        );
});

test('includes the approver for reviewed employee leave requests', function () {
    $employee = User::factory()->create();
    $approver = User::factory()->create(['role' => 'administrator']);
    $leaveRequest = LeaveRequest::factory()
        ->for($employee)
        ->for(LeaveType::factory())
        ->create([
            'status' => 'approved',
            'reviewed_by' => $approver->id,
            'reviewed_at' => now(),
        ]);

    $this->actingAs($employee)
        ->get(route('leave-requests.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('leave-requests/index')
            ->where('leaveRequests.0.id', $leaveRequest->id)
            ->where('leaveRequests.0.reviewer.id', $approver->id)
            ->where('leaveRequests.0.reviewer.name', $approver->name),
        );
});

test('shows an employee their used leave days when limits are enforced', function () {
    LeaveSetting::factory()->create([
        'enforce_leave_limits' => true,
    ]);
    $employee = User::factory()->create();
    $leaveType = LeaveType::factory()->create([
        'name' => 'Vacation Leave',
        'day_limit' => 10,
    ]);
    LeaveRequest::factory()
        ->for($employee)
        ->for($leaveType)
        ->create([
            'start_date' => '2026-09-10',
            'end_date' => '2026-09-11',
            'status' => 'approved',
        ]);

    $this->actingAs($employee)
        ->get(route('leave-requests.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('leave-requests/index')
            ->where('enforceLeaveLimits', true)
            ->where('leaveTypes.0.day_limit', 10)
            ->where('leaveTypes.0.used_days', 2),
        );
});

test('filters only the authenticated employee requests by status, leave type, and overlapping dates', function () {
    $employee = User::factory()->create();
    $otherEmployee = User::factory()->create();
    $leaveType = LeaveType::factory()->create();
    $otherLeaveType = LeaveType::factory()->create();
    $matchingRequest = LeaveRequest::factory()
        ->for($employee)
        ->for($leaveType)
        ->create([
            'start_date' => '2026-08-31',
            'end_date' => '2026-09-03',
            'status' => 'pending',
        ]);
    LeaveRequest::factory()->for($employee)->for($otherLeaveType)->create([
        'start_date' => '2026-09-01',
        'end_date' => '2026-09-03',
        'status' => 'pending',
    ]);
    LeaveRequest::factory()->for($otherEmployee)->for($leaveType)->create([
        'start_date' => '2026-09-01',
        'end_date' => '2026-09-03',
        'status' => 'pending',
    ]);

    $this->actingAs($employee)
        ->get(route('leave-requests.index', [
            'start_date' => '2026-09-01',
            'end_date' => '2026-09-15',
            'status' => 'pending',
            'leave_type_id' => $leaveType->id,
        ]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('leave-requests/index')
            ->where('filters.start_date', '2026-09-01')
            ->where('filters.end_date', '2026-09-15')
            ->where('filters.status', 'pending')
            ->where('filters.leave_type_id', $leaveType->id)
            ->has('leaveRequests', 1)
            ->where('leaveRequests.0.id', $matchingRequest->id),
        );
});

test('returns the selected filters for the administrative review list', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    $employee = User::factory()->create();
    $leaveType = LeaveType::factory()->create();
    LeaveRequest::factory()
        ->for($employee)
        ->for($leaveType)
        ->create(['status' => 'pending']);

    $this->actingAs($administrator)
        ->get(route('admin.leave-requests.index', [
            'status' => 'pending',
            'leave_type_id' => $leaveType->id,
        ]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/leave-requests/index')
            ->where('filters.status', 'pending')
            ->where('filters.leave_type_id', $leaveType->id),
        );
});

test('searches the administrative review list by employee name or email', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    $matchingEmployee = User::factory()->create([
        'name' => 'Taylor Employee',
        'email' => 'taylor@example.test',
    ]);
    $otherEmployee = User::factory()->create();
    $leaveType = LeaveType::factory()->create();
    $matchingRequest = LeaveRequest::factory()
        ->for($matchingEmployee)
        ->for($leaveType)
        ->create();
    LeaveRequest::factory()->for($otherEmployee)->for($leaveType)->create();

    $this->actingAs($administrator)
        ->get(route('admin.leave-requests.index', ['search' => 'taylor@example.test']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/leave-requests/index')
            ->where('filters.search', 'taylor@example.test')
            ->has('leaveRequests', 1)
            ->where('leaveRequests.0.id', $matchingRequest->id),
        );
});

test('returns administrative leave requests that overlap the selected date range', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    $employee = User::factory()->create();
    $leaveType = LeaveType::factory()->create();
    $overlappingStart = LeaveRequest::factory()
        ->for($employee)
        ->for($leaveType)
        ->create([
            'start_date' => '2026-08-31',
            'end_date' => '2026-09-03',
            'created_at' => '2026-01-01 00:00:00',
        ]);
    $withinRange = LeaveRequest::factory()
        ->for($employee)
        ->for($leaveType)
        ->create([
            'start_date' => '2026-09-10',
            'end_date' => '2026-09-12',
            'created_at' => '2026-01-02 00:00:00',
        ]);
    $touchingEnd = LeaveRequest::factory()
        ->for($employee)
        ->for($leaveType)
        ->create([
            'start_date' => '2026-09-15',
            'end_date' => '2026-09-16',
            'created_at' => '2026-01-03 00:00:00',
        ]);
    LeaveRequest::factory()->for($employee)->for($leaveType)->create([
        'start_date' => '2026-08-29',
        'end_date' => '2026-08-31',
    ]);
    LeaveRequest::factory()->for($employee)->for($leaveType)->create([
        'start_date' => '2026-09-16',
        'end_date' => '2026-09-17',
    ]);

    $this->actingAs($administrator)
        ->get(route('admin.leave-requests.index', [
            'start_date' => '2026-09-01',
            'end_date' => '2026-09-15',
        ]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/leave-requests/index')
            ->where('filters.start_date', '2026-09-01')
            ->where('filters.end_date', '2026-09-15')
            ->has('leaveRequests', 3)
            ->where('leaveRequests.0.id', $touchingEnd->id)
            ->where('leaveRequests.1.id', $withinRange->id)
            ->where('leaveRequests.2.id', $overlappingStart->id),
        );
});
