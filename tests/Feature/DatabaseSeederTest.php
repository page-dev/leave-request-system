<?php

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('seeds an administrator account idempotently', function () {
    $seeder = new DatabaseSeeder;

    $seeder->run();
    $seeder->run();

    $administrator = User::query()
        ->where('email', 'admin@example.com')
        ->sole();

    expect($administrator->first_name)->toBe('Administrator')
        ->and($administrator->last_name)->toBe('User')
        ->and($administrator->name)->toBe('Administrator User')
        ->and($administrator->role)->toBe('administrator')
        ->and(Hash::check('password', $administrator->password))->toBeTrue();

    $this->assertDatabaseCount('users', 2);
});
