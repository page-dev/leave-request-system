<?php

namespace Database\Seeders;

use App\Models\LeaveSetting;
use Illuminate\Database\Seeder;

class LeaveSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LeaveSetting::query()->updateOrCreate(
            ['id' => 1],
            [
                'counted_weekdays' => LeaveSetting::DefaultCountedWeekdays,
                'minimum_notice_days' => LeaveSetting::DefaultMinimumNoticeDays,
                'enforce_leave_limits' => LeaveSetting::DefaultEnforceLeaveLimits,
            ],
        );
    }
}
