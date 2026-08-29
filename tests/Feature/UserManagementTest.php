<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('renders the user management page with matching search and filters', function () {
    $administrator = User::factory()->create([
        'first_name' => 'Administrator',
        'last_name' => 'User',
        'role' => 'administrator',
    ]);
    $matchingUser = User::factory()->create([
        'first_name' => 'Avery',
        'last_name' => 'Employee',
        'email' => 'avery@example.com',
        'is_active' => true,
    ]);
    $inactiveUser = User::factory()->create([
        'first_name' => 'Inactive',
        'last_name' => 'Employee',
        'is_active' => false,
    ]);

    $this->actingAs($administrator)
        ->get(route('admin.users.index', [
            'search' => 'avery',
            'status' => 'active',
            'role' => 'employee',
        ]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/index')
            ->where('users.0.id', $matchingUser->id)
            ->has('users', 1)
            ->where('filters.search', 'avery')
            ->where('filters.status', 'active')
            ->where('filters.role', 'employee'),
        );

    $this->assertModelExists($inactiveUser);
});

test('administrators can create users', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);

    $response = $this->actingAs($administrator)->post(route('admin.users.store'), [
        'first_name' => 'New',
        'last_name' => 'Employee',
        'email' => 'new.employee@example.com',
        'role' => 'employee',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response
        ->assertRedirect(route('admin.users.index'))
        ->assertInertiaFlash('toast.message', 'User created.');
    $this->assertDatabaseHas('users', [
        'first_name' => 'New',
        'last_name' => 'Employee',
        'email' => 'new.employee@example.com',
        'role' => 'employee',
        'is_active' => true,
    ]);
});

test('creating a user validates the required account details', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);

    $this->actingAs($administrator)
        ->post(route('admin.users.store'))
        ->assertSessionHasErrors(['first_name', 'last_name', 'email', 'role', 'password']);
});

test('administrators can update users without changing their password', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    $user = User::factory()->create([
        'first_name' => 'Original',
        'last_name' => 'Name',
        'email' => 'original@example.com',
    ]);
    $passwordHash = $user->password;

    $response = $this->actingAs($administrator)->put(route('admin.users.update', $user), [
        'first_name' => 'Updated',
        'last_name' => 'Name',
        'email' => 'updated@example.com',
        'role' => 'employee',
        'password' => '',
        'password_confirmation' => '',
    ]);

    $response
        ->assertRedirect()
        ->assertInertiaFlash('toast.message', 'User updated.');
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'first_name' => 'Updated',
        'last_name' => 'Name',
        'email' => 'updated@example.com',
        'password' => $passwordHash,
    ]);
});

test('employees cannot manage users', function () {
    $employee = User::factory()->create(['role' => 'employee']);
    $managedUser = User::factory()->create();

    $this->actingAs($employee)
        ->get(route('admin.users.index'))
        ->assertForbidden();

    $this->actingAs($employee)
        ->post(route('admin.users.store'), [
            'first_name' => 'Unauthorized',
            'last_name' => 'User',
            'email' => 'unauthorized@example.com',
            'role' => 'employee',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])
        ->assertForbidden();

    $this->actingAs($employee)
        ->put(route('admin.users.update', $managedUser), [
            'first_name' => $managedUser->first_name,
            'last_name' => $managedUser->last_name,
            'email' => $managedUser->email,
            'role' => 'employee',
            'password' => '',
            'password_confirmation' => '',
        ])
        ->assertForbidden();

    $this->actingAs($employee)
        ->patch(route('admin.users.toggle-activation', $managedUser))
        ->assertForbidden();
});

test('administrators cannot deactivate their own account', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    User::factory()->create(['role' => 'administrator']);

    $response = $this->actingAs($administrator)
        ->patch(route('admin.users.toggle-activation', $administrator));

    $response
        ->assertRedirect()
        ->assertInertiaFlash('toast.message', 'You cannot deactivate your own account.');
    $this->assertDatabaseHas('users', [
        'id' => $administrator->id,
        'is_active' => true,
    ]);
});

test('administrators cannot deactivate the last active administrator', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    $lastAdministrator = User::factory()->create(['role' => 'administrator']);
    $administrator->update(['is_active' => false]);

    $response = $this->actingAs($administrator)
        ->patch(route('admin.users.toggle-activation', $lastAdministrator));

    $response
        ->assertRedirect()
        ->assertInertiaFlash('toast.message', 'At least one active administrator must remain.');
    $this->assertDatabaseHas('users', [
        'id' => $lastAdministrator->id,
        'is_active' => true,
    ]);
});

test('administrators cannot demote the last active administrator', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    $lastAdministrator = User::factory()->create(['role' => 'administrator']);
    $administrator->update(['is_active' => false]);

    $response = $this->actingAs($administrator)
        ->put(route('admin.users.update', $lastAdministrator), [
            'first_name' => $lastAdministrator->first_name,
            'last_name' => $lastAdministrator->last_name,
            'email' => $lastAdministrator->email,
            'role' => 'employee',
            'password' => '',
            'password_confirmation' => '',
        ]);

    $response
        ->assertRedirect()
        ->assertInertiaFlash('toast.message', 'At least one active administrator must remain.');
    $this->assertDatabaseHas('users', [
        'id' => $lastAdministrator->id,
        'role' => 'administrator',
    ]);
});

test('administrators can deactivate another user when an active administrator remains', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    $employee = User::factory()->create(['role' => 'employee']);

    $response = $this->actingAs($administrator)
        ->patch(route('admin.users.toggle-activation', $employee));

    $response
        ->assertRedirect()
        ->assertInertiaFlash('toast.message', 'User deactivated.');
    $this->assertDatabaseHas('users', [
        'id' => $employee->id,
        'is_active' => false,
    ]);
});

test('administrators can activate an inactive user', function () {
    $administrator = User::factory()->create(['role' => 'administrator']);
    $employee = User::factory()->create(['is_active' => false]);

    $response = $this->actingAs($administrator)
        ->patch(route('admin.users.toggle-activation', $employee));

    $response
        ->assertRedirect()
        ->assertInertiaFlash('toast.message', 'User activated.');
    $this->assertDatabaseHas('users', [
        'id' => $employee->id,
        'is_active' => true,
    ]);
});

test('deactivated users cannot authenticate', function () {
    $user = User::factory()->create([
        'email' => 'inactive@example.com',
        'is_active' => false,
    ]);

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});
