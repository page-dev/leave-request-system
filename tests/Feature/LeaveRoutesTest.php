<?php

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
});
