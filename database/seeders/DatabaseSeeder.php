<?php

namespace Database\Seeders;

use App\Models\LeaveType;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(LeaveSettingSeeder::class);

        $employee = User::query()->firstOrNew([
            'email' => 'employee@example.com',
        ]);

        $employee->forceFill([
            'first_name' => 'Employee',
            'last_name' => 'User',
            'name' => 'Employee User',
            'password' => Hash::make('password'),
            'role' => 'employee',
            'is_active' => true,
        ])->save();

        $administrator = User::query()->firstOrNew([
            'email' => 'admin@example.com',
        ]);

        $administrator->forceFill([
            'first_name' => 'Administrator',
            'last_name' => 'User',
            'name' => 'Administrator User',
            'password' => Hash::make('password'),
            'role' => 'administrator',
            'is_active' => true,
        ])->save();

        foreach ([
            [
                'name' => 'Vacation Leave',
                'description' => 'Planned time away from work.',
                'day_limit' => 15,
            ],
            [
                'name' => 'Sick Leave',
                'description' => 'Time away needed for illness or recovery.',
                'day_limit' => 10,
            ],
        ] as $leaveType) {
            LeaveType::query()->updateOrCreate(
                ['name' => $leaveType['name']],
                $leaveType,
            );
        }
    }
}
