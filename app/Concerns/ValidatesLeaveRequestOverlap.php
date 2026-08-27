<?php

namespace App\Concerns;

use App\Models\LeaveRequest;
use App\Models\User;
use Closure;
use Illuminate\Validation\Validator;

trait ValidatesLeaveRequestOverlap
{
    /**
     * Create an after-validation check that rejects ranges overlapping a pending or approved leave request.
     */
    protected function validateLeaveRequestOverlap(?LeaveRequest $except = null): Closure
    {
        return function (Validator $validator) use ($except): void {
            if ($validator->errors()->has('start_date') || $validator->errors()->has('end_date')) {
                return;
            }

            $user = $this->user();

            if (! $user instanceof User) {
                return;
            }

            $validated = $validator->validated();
            $existingRequests = $user->leaveRequests()
                ->whereIn('status', ['pending', 'approved']);

            if ($except !== null) {
                $existingRequests->where($except->getKeyName(), '!=', $except->getKey());
            }

            $overlaps = $existingRequests
                ->where('start_date', '<=', $validated['end_date'])
                ->where('end_date', '>=', $validated['start_date'])
                ->exists();

            if ($overlaps) {
                $validator->errors()->add('end_date', __('The selected dates overlap with an existing pending or approved leave request.'));
            }
        };
    }
}
