<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price_per_night' => ['required', 'numeric', 'min:0'],
            'city_id' => ['required', 'exists:cities,id'],
            'amenities' => ['sometimes', 'array'],
            'amenities.*' => ['string'],
            'images' => ['sometimes', 'array'],
            'images.*' => ['string', 'url'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
