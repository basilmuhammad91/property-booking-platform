<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;

class BookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['required', 'date', 'after:start_date'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($this->start_date && $this->end_date) {
                $startDate = Carbon::parse($this->start_date);
                $endDate = Carbon::parse($this->end_date);

                if ($startDate->diffInDays($endDate) < 1) {
                    $validator->errors()->add('end_date', 'Booking must be for at least one night.');
                }
            }
        });
    }
}
