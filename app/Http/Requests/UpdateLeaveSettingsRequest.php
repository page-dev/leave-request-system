<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateLeaveSettingsRequest extends FormRequest
{
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
            'counted_weekdays' => ['required', 'array', 'min:1'],
            'counted_weekdays.*' => ['required', 'integer', 'distinct', 'between:1,7'],
            'minimum_notice_days' => ['required', 'integer', 'min:0'],
            'enforce_leave_limits' => ['required', 'boolean'],
        ];
    }
}
