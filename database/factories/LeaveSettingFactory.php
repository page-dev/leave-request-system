<?php

namespace Database\Factories;

use App\Models\LeaveSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LeaveSetting>
 */
class LeaveSettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'counted_weekdays' => LeaveSetting::DefaultCountedWeekdays,
            'minimum_notice_days' => LeaveSetting::DefaultMinimumNoticeDays,
            'enforce_leave_limits' => LeaveSetting::DefaultEnforceLeaveLimits,
        ];
    }
}
