<?php

namespace App\Http\Requests;

use App\Concerns\ValidatesLeaveRequestLimit;
use App\Concerns\ValidatesLeaveRequestNotice;
use App\Concerns\ValidatesLeaveRequestOverlap;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLeaveRequestRequest extends FormRequest
{
    use ValidatesLeaveRequestLimit, ValidatesLeaveRequestNotice, ValidatesLeaveRequestOverlap;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'leave_type_id' => ['required', 'integer', Rule::exists(LeaveType::class, 'id')],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['required', 'string', 'max:5000'],
        ];
    }

    /**
     * Get the additional validation callables for the request.
     *
     * @return array<callable>
     */
    public function after(): array
    {
        $leaveRequest = $this->route('leave_request');

        return [
            $this->validateLeaveRequestOverlap($leaveRequest instanceof LeaveRequest ? $leaveRequest : null),
            $this->validateLeaveRequestNotice(),
            $this->validateLeaveRequestLimit($leaveRequest instanceof LeaveRequest ? $leaveRequest : null),
        ];
    }
}
