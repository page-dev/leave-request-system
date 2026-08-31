<?php

use Tests\TestCase;

uses(TestCase::class);

test('health endpoint returns an ok status without authentication', function () {
    $this->get(route('health'))
        ->assertOk()
        ->assertJsonPath('status', 'ok');
});
