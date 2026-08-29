<?php

use App\Models\LeaveRequest;
use App\Models\LeaveSetting;
use App\Models\LeaveType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('rejects a request that exceeds an enforced leave-type limit', function () {
    LeaveSetting::factory()->create([
        'enforce_leave_limits' => true,
        'minimum_notice_days' => 0,
    ]);
    $employee = User::factory()->create();
    $leaveType = LeaveType::factory()->create([
        'name' => 'Vacation Leave',
        'day_limit' => 1,
    ]);
    LeaveRequest::factory()
        ->for($employee)
        ->for($leaveType)
        ->create([
            'start_date' => '2026-09-10',
            'end_date' => '2026-09-10',
        ]);

    $response = $this->actingAs($employee)
        ->from(route('leave-requests.create'))
        ->post(route('leave-requests.store'), [
            'leave_type_id' => $leaveType->id,
            'start_date' => '2026-09-11',
            'end_date' => '2026-09-11',
            'reason' => 'Personal time.',
        ]);

    $response->assertRedirect(route('leave-requests.create'))
        ->assertSessionHasErrors([
            'end_date' => 'This request exceeds the 1-day Vacation Leave limit.',
        ]);

    $this->assertDatabaseCount('leave_requests', 1);
});

test('allows a request above a leave-type limit when enforcement is disabled', function () {
    LeaveSetting::factory()->create([
        'enforce_leave_limits' => false,
        'minimum_notice_days' => 0,
    ]);
    $employee = User::factory()->create();
    $leaveType = LeaveType::factory()->create(['day_limit' => 1]);
    LeaveRequest::factory()
        ->for($employee)
        ->for($leaveType)
        ->create([
            'start_date' => '2026-09-10',
            'end_date' => '2026-09-10',
        ]);

    $response = $this->actingAs($employee)
        ->post(route('leave-requests.store'), [
            'leave_type_id' => $leaveType->id,
            'start_date' => '2026-09-11',
            'end_date' => '2026-09-11',
            'reason' => 'Personal time.',
        ]);

    $response->assertRedirect(route('leave-requests.index'))
        ->assertValid();

    $this->assertDatabaseCount('leave_requests', 2);
});
