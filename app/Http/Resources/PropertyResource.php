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
            'amenities' => $this->amenities ? json_decode($this->amenities) : [],
            'images' => $this->images ? json_decode($this->images) : [],
            'is_active' => $this->is_active,
            'city' => new CityResource($this->whenLoaded('city')),
            'availability' => $this->whenLoaded('availability'),
            'bookings' => BookingResource::collection($this->whenLoaded('bookings')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
