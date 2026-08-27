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
        $employee = User::query()->firstOrNew([
            'email' => 'employee@example.com',
        ]);

        $employee->forceFill([
            'name' => 'Employee User',
            'password' => Hash::make('password'),
            'role' => 'employee',
        ])->save();

        $administrator = User::query()->firstOrNew([
            'email' => 'admin@example.com',
        ]);

        $administrator->forceFill([
            'name' => 'Administrator User',
            'password' => Hash::make('password'),
            'role' => 'administrator',
        ])->save();

        foreach ([
            [
                'name' => 'Vacation Leave',
                'description' => 'Planned time away from work.',
            ],
            [
                'name' => 'Sick Leave',
                'description' => 'Time away needed for illness or recovery.',
            ],
        ] as $leaveType) {
            LeaveType::query()->updateOrCreate(
                ['name' => $leaveType['name']],
                $leaveType,
            );
        }
    }
}
