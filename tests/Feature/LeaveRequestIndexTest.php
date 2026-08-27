<?php

use App\Models\LeaveRequest;
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
