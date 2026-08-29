<?php

use App\Models\LeaveType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('renders the leave type management page for administrators', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    $leaveType = LeaveType::factory()->create();

    $this->actingAs($administrator)
        ->get(route('admin.leave-types.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/leave-types/index')
            ->where('leaveTypes.0.id', $leaveType->id)
            ->where('leaveTypes.0.leave_requests_count', 0),
        );
});

test('administrators can create leave types with an optional day limit', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);

    $this->actingAs($administrator)
        ->post(route('admin.leave-types.store'), [
            'name' => 'Bereavement Leave',
            'description' => 'Leave following the death of an immediate family member.',
            'day_limit' => 5,
        ])
        ->assertRedirect(route('admin.leave-types.index'));

    $this->assertDatabaseHas('leave_types', [
        'name' => 'Bereavement Leave',
        'day_limit' => 5,
    ]);
});

test('administrators can create leave types without a day limit', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);

    $this->actingAs($administrator)
        ->post(route('admin.leave-types.store'), [
            'name' => 'Volunteer Leave',
            'description' => 'Time away to volunteer with an approved organization.',
        ])
        ->assertRedirect(route('admin.leave-types.index'));

    $this->assertDatabaseHas('leave_types', [
        'name' => 'Volunteer Leave',
        'day_limit' => null,
    ]);
});

test('leave type day limits must be greater than zero', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);

    $this->actingAs($administrator)
        ->from(route('admin.leave-types.index'))
        ->post(route('admin.leave-types.store'), [
            'name' => 'Study Leave',
            'description' => 'Time away for approved professional study.',
            'day_limit' => 0,
        ])
        ->assertRedirect(route('admin.leave-types.index'))
        ->assertSessionHasErrors('day_limit');

    $this->assertDatabaseCount('leave_types', 0);
});
