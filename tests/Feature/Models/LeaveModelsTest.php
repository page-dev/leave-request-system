<?php

use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Tests\TestCase;

uses(TestCase::class);

test('leave requests declare their user, leave type, and reviewer relationships', function () {
    $leaveRequest = new LeaveRequest;

    expect($leaveRequest->user())->toBeInstanceOf(BelongsTo::class)
        ->and($leaveRequest->user()->getForeignKeyName())->toBe('user_id')
        ->and($leaveRequest->leaveType())->toBeInstanceOf(BelongsTo::class)
        ->and($leaveRequest->leaveType()->getForeignKeyName())->toBe('leave_type_id')
        ->and($leaveRequest->reviewer())->toBeInstanceOf(BelongsTo::class)
        ->and($leaveRequest->reviewer()->getForeignKeyName())->toBe('reviewed_by');
});

test('users and leave types declare their leave request relationships', function () {
    $user = new User;
    $leaveType = new LeaveType;

    expect($user->leaveRequests())->toBeInstanceOf(HasMany::class)
        ->and($user->leaveRequests()->getForeignKeyName())->toBe('user_id')
        ->and($user->reviewedLeaveRequests())->toBeInstanceOf(HasMany::class)
        ->and($user->reviewedLeaveRequests()->getForeignKeyName())->toBe('reviewed_by')
        ->and($leaveType->leaveRequests())->toBeInstanceOf(HasMany::class)
        ->and($leaveType->leaveRequests()->getForeignKeyName())->toBe('leave_type_id');
});

test('leave requests cast dates and protect server-managed attributes', function () {
    $leaveRequest = new LeaveRequest([
        'leave_type_id' => 1,
        'start_date' => '2026-09-01',
        'end_date' => '2026-09-05',
        'reason' => 'Family vacation.',
        'user_id' => 2,
        'status' => 'approved',
        'reviewed_by' => 3,
    ]);

    expect($leaveRequest->getCasts()['start_date'])->toBe('date')
        ->and($leaveRequest->getCasts()['end_date'])->toBe('date')
        ->and($leaveRequest->getCasts()['reviewed_at'])->toBe('datetime')
        ->and($leaveRequest->getAttribute('user_id'))->toBeNull()
        ->and($leaveRequest->getAttribute('status'))->toBeNull()
        ->and($leaveRequest->getAttribute('reviewed_by'))->toBeNull();
});

test('leave requests serialize only the configured weekdays in their day count', function () {
    $leaveRequest = new LeaveRequest;
    $leaveRequest->start_date = '2026-09-10';
    $leaveRequest->end_date = '2026-09-14';

    expect($leaveRequest->toArray()['days'])->toBe(3);
});
