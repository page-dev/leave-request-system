<?php

namespace App\Concerns;

use App\Models\LeaveSetting;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Validation\Validator;

trait ValidatesLeaveRequestNotice
{
    /**
     * Create an after-validation check that enforces the configured request notice period.
     */
    protected function validateLeaveRequestNotice(): Closure
    {
        return function (Validator $validator): void {
            if ($validator->errors()->has('start_date')) {
                return;
            }

            $minimumNoticeDays = LeaveSetting::minimumNoticeDays();
            $startDate = CarbonImmutable::parse($this->input('start_date'))->startOfDay();
            $minimumStartDate = today()->startOfDay()->addDays($minimumNoticeDays);

            if ($startDate->lt($minimumStartDate)) {
                $dayLabel = $minimumNoticeDays === 1 ? __('day') : __('days');

                $validator->errors()->add(
                    'start_date',
                    __('Leave request notice must be at least :days :day before the actual leave date.', [
                        'days' => $minimumNoticeDays,
                        'day' => $dayLabel,
                    ]),
                );
            }
        };
    }
}
