<?php

namespace App\Concerns;

use App\Models\LeaveRequest;
use App\Models\LeaveSetting;
use App\Models\LeaveType;
use App\Models\User;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Validation\Validator;

trait ValidatesLeaveRequestLimit
{
    /**
     * Create an after-validation check that enforces the configured leave-type day limit.
     */
    protected function validateLeaveRequestLimit(?LeaveRequest $except = null): Closure
    {
        return function (Validator $validator) use ($except): void {
            if (
                $validator->errors()->has('leave_type_id')
                || $validator->errors()->has('start_date')
                || $validator->errors()->has('end_date')
                || ! LeaveSetting::enforcesLeaveLimits()
            ) {
                return;
            }

            $user = $this->user();

            if (! $user instanceof User) {
                return;
            }

            $leaveType = LeaveType::query()->find($this->integer('leave_type_id'));

            if ($leaveType?->day_limit === null) {
                return;
            }

            $validated = $validator->validated();
            $countedWeekdays = LeaveSetting::countedWeekdays();
            $existingRequests = $user->leaveRequests()
                ->where('leave_type_id', $leaveType->getKey())
                ->whereIn('status', ['pending', 'approved']);

            if ($except !== null) {
                $existingRequests->where($except->getKeyName(), '!=', $except->getKey());
            }

            $usedDays = $existingRequests
                ->get(['start_date', 'end_date'])
                ->sum(fn (LeaveRequest $leaveRequest): int => LeaveSetting::countLeaveDays(
                    $leaveRequest->start_date,
                    $leaveRequest->end_date,
                    $countedWeekdays,
                ));
            $requestedDays = LeaveSetting::countLeaveDays(
                CarbonImmutable::parse($validated['start_date']),
                CarbonImmutable::parse($validated['end_date']),
                $countedWeekdays,
            );

            if ($usedDays + $requestedDays > $leaveType->day_limit) {
                $dayLabel = $leaveType->day_limit === 1 ? __('day') : __('days');

                $validator->errors()->add(
                    'end_date',
                    __('This request exceeds the :limit-:day :leaveType limit.', [
                        'limit' => $leaveType->day_limit,
                        'day' => $dayLabel,
                        'leaveType' => $leaveType->name,
                    ]),
                );
            }
        };
    }
}
