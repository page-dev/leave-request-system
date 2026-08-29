<?php

use App\Models\LeaveSetting;
use App\Models\LeaveType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('rejects a request submitted without the configured minimum notice', function () {
    travelTo('2026-09-01 09:00:00');

    try {
        LeaveSetting::factory()->create(['minimum_notice_days' => 3]);
        $employee = User::factory()->create();
        $leaveType = LeaveType::factory()->create();

        $response = $this->actingAs($employee)
            ->from(route('leave-requests.create'))
            ->post(route('leave-requests.store'), [
                'leave_type_id' => $leaveType->id,
                'start_date' => '2026-09-03',
                'end_date' => '2026-09-04',
                'reason' => 'Personal appointment.',
            ]);

        $response->assertRedirect(route('leave-requests.create'))
            ->assertSessionHasErrors([
                'start_date' => 'Leave request notice must be at least 3 days before the actual leave date.',
            ]);

        $this->assertDatabaseCount('leave_requests', 0);
    } finally {
        travelBack();
    }
});
