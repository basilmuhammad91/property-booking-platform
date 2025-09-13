<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'price_per_night' => $this->price_per_night,
            'amenities' => $this->safeJsonDecode($this->amenities),
            'images' => $this->safeJsonDecode($this->images),
            'is_active' => $this->is_active,
            'city' => new CityResource($this->whenLoaded('city')),
            'availability' => $this->whenLoaded('availability'),
            'bookings' => BookingResource::collection($this->whenLoaded('bookings')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    protected function safeJsonDecode($value)
    {
        if (is_array($value) || is_object($value)) {
            return $value;
        }

        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return json_last_error() === JSON_ERROR_NONE ? $decoded : [];
        }

        return [];
    }
}
