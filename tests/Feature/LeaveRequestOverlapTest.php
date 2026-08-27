<?php

use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('rejects a new request that overlaps a pending request', function () {
    $employee = User::factory()->create();
    $leaveType = LeaveType::factory()->create();
    LeaveRequest::factory()
        ->for($employee)
        ->for($leaveType)
        ->create([
            'start_date' => '2026-09-10',
            'end_date' => '2026-09-14',
        ]);

    $response = $this->actingAs($employee)
        ->from(route('leave-requests.create'))
        ->post(route('leave-requests.store'), [
            'leave_type_id' => $leaveType->id,
            'start_date' => '2026-09-14',
            'end_date' => '2026-09-18',
            'reason' => 'Family vacation.',
        ]);

    $response->assertRedirect(route('leave-requests.create'))
        ->assertSessionHasErrors([
            'end_date' => 'The selected dates overlap with an existing pending or approved leave request.',
        ]);

    $this->assertDatabaseCount('leave_requests', 1);
});

test('allows a pending request to be updated without conflicting with itself', function () {
    $employee = User::factory()->create();
    $leaveType = LeaveType::factory()->create();
    $leaveRequest = LeaveRequest::factory()
        ->for($employee)
        ->for($leaveType)
        ->create([
            'start_date' => '2026-09-10',
            'end_date' => '2026-09-14',
        ]);

    $response = $this->actingAs($employee)
        ->patch(route('leave-requests.update', $leaveRequest), [
            'leave_type_id' => $leaveType->id,
            'start_date' => '2026-09-10',
            'end_date' => '2026-09-14',
            'reason' => 'Updated family vacation reason.',
        ]);

    $response->assertRedirect(route('leave-requests.index'))
        ->assertValid();

    $this->assertDatabaseHas('leave_requests', [
        'id' => $leaveRequest->id,
        'reason' => 'Updated family vacation reason.',
    ]);
});

test('rejects a new request that overlaps an approved request', function () {
    $employee = User::factory()->create();
    $leaveType = LeaveType::factory()->create();
    LeaveRequest::factory()
        ->for($employee)
        ->for($leaveType)
        ->create([
            'start_date' => '2026-09-10',
            'end_date' => '2026-09-14',
            'status' => 'approved',
        ]);

    $response = $this->actingAs($employee)
        ->post(route('leave-requests.store'), [
            'leave_type_id' => $leaveType->id,
            'start_date' => '2026-09-12',
            'end_date' => '2026-09-16',
            'reason' => 'Rescheduled leave.',
        ]);

    $response->assertRedirect(route('leave-requests.create'))
        ->assertSessionHasErrors([
            'end_date' => 'The selected dates overlap with an existing pending or approved leave request.',
        ]);

    $this->assertDatabaseCount('leave_requests', 1);
});

test('allows a new request that overlaps a rejected request', function () {
    $employee = User::factory()->create();
    $leaveType = LeaveType::factory()->create();
    LeaveRequest::factory()
        ->for($employee)
        ->for($leaveType)
        ->create([
            'start_date' => '2026-09-10',
            'end_date' => '2026-09-14',
            'status' => 'rejected',
        ]);

    $response = $this->actingAs($employee)
        ->post(route('leave-requests.store'), [
            'leave_type_id' => $leaveType->id,
            'start_date' => '2026-09-12',
            'end_date' => '2026-09-16',
            'reason' => 'Rescheduled leave.',
        ]);

    $response->assertRedirect(route('leave-requests.index'))
        ->assertValid();

    $this->assertDatabaseCount('leave_requests', 2);
});
