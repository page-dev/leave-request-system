<?php

use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\User;
use App\Policies\LeaveRequestPolicy;
use App\Policies\LeaveTypePolicy;
use App\Policies\UserPolicy;

test('employees can manage only their own pending leave requests', function () {
    $employee = new User;
    $employee->id = 1;
    $employee->role = 'employee';

    $otherEmployee = new User;
    $otherEmployee->id = 2;
    $otherEmployee->role = 'employee';

    $pendingRequest = new LeaveRequest;
    $pendingRequest->user_id = $employee->id;
    $pendingRequest->status = 'pending';

    $reviewedRequest = new LeaveRequest;
    $reviewedRequest->user_id = $employee->id;
    $reviewedRequest->status = 'approved';

    $policy = new LeaveRequestPolicy;

    expect($policy->viewAny($employee))->toBeTrue()
        ->and($policy->create($employee))->toBeTrue()
        ->and($policy->view($employee, $pendingRequest))->toBeTrue()
        ->and($policy->update($employee, $pendingRequest))->toBeTrue()
        ->and($policy->delete($employee, $pendingRequest))->toBeTrue()
        ->and($policy->update($otherEmployee, $pendingRequest))->toBeFalse()
        ->and($policy->delete($employee, $reviewedRequest))->toBeFalse();
});

test('administrators can manage leave types and review pending requests', function () {
    $administrator = new User;
    $administrator->id = 1;
    $administrator->role = 'administrator';

    $pendingRequest = new LeaveRequest;
    $pendingRequest->user_id = 2;
    $pendingRequest->status = 'pending';

    $reviewedRequest = new LeaveRequest;
    $reviewedRequest->user_id = 2;
    $reviewedRequest->status = 'rejected';

    $leaveType = new LeaveType;

    $leaveRequestPolicy = new LeaveRequestPolicy;
    $leaveTypePolicy = new LeaveTypePolicy;
    $userPolicy = new UserPolicy;

    expect($leaveRequestPolicy->viewAny($administrator))->toBeFalse()
        ->and($leaveRequestPolicy->view($administrator, $pendingRequest))->toBeTrue()
        ->and($leaveRequestPolicy->reviewAny($administrator))->toBeTrue()
        ->and($leaveRequestPolicy->review($administrator, $pendingRequest))->toBeTrue()
        ->and($leaveRequestPolicy->review($administrator, $reviewedRequest))->toBeFalse()
        ->and($leaveTypePolicy->create($administrator))->toBeTrue()
        ->and($leaveTypePolicy->update($administrator, $leaveType))->toBeTrue()
        ->and($leaveTypePolicy->delete($administrator, $leaveType))->toBeTrue()
        ->and($userPolicy->viewAny($administrator))->toBeTrue();
});
