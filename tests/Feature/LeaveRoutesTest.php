<?php

use App\Models\User;
use Tests\TestCase;

uses(TestCase::class);

test('guests are redirected to login from employee leave request routes', function () {
    $this->get(route('leave-requests.index'))
        ->assertRedirect(route('login'));

    $this->get(route('leave-requests.create'))
        ->assertRedirect(route('login'));
});

test('guests are redirected to login from administrative routes', function () {
    $this->get(route('admin.users.index'))
        ->assertRedirect(route('login'));

    $this->get(route('admin.leave-types.index'))
        ->assertRedirect(route('login'));

    $this->get(route('admin.leave-requests.index'))
        ->assertRedirect(route('login'));

    $this->get(route('admin.settings.general'))
        ->assertRedirect(route('login'));
});

test('only administrators can access general settings', function () {
    $employee = User::factory()->create();
    $administrator = User::factory()->create(['role' => 'administrator']);

    $this->actingAs($employee)
        ->get(route('admin.settings.general'))
        ->assertForbidden();

    $this->actingAs($administrator)
        ->get(route('admin.settings.general'))
        ->assertInertia(fn ($page) => $page->component('admin/settings/general'));
});

test('redirects legacy leave type form URLs without rendering pages', function () {
    $this->get('/admin/leave-types/create')
        ->assertRedirect(route('login'));

    $this->get('/admin/leave-types/1/edit')
        ->assertRedirect(route('login'));
});
