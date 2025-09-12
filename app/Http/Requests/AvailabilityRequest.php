<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'availability' => ['required', 'array'],
            'availability.*.start_date' => ['required', 'date'],
            'availability.*.end_date' => ['required', 'date', 'after_or_equal:availability.*.start_date'],
            'availability.*.is_available' => ['required', 'boolean'],
        ];
    }
}
