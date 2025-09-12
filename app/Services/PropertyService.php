<?php

namespace App\Services;

use App\Models\Property;
use App\Models\PropertyAvailability;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PropertyService
{
    public function searchProperties(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = Property::query()
            ->with(['city'])
            ->active();

        if (!empty($filters['city_id'])) {
            $query->byCity($filters['city_id']);
        }

        if (!empty($filters['min_price']) || !empty($filters['max_price'])) {
            $query->byPriceRange($filters['min_price'] ?? null, $filters['max_price'] ?? null);
        }

        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $query->availableForDates($filters['start_date'], $filters['end_date']);
        }

        if (!empty($filters['amenities'])) {
            foreach ($filters['amenities'] as $amenity) {
                $query->whereJsonContains('amenities', $amenity);
            }
        }

        return $query->paginate($perPage);
    }

    public function createProperty(array $data): Property
    {
        return DB::transaction(function () use ($data) {
            return Property::create($data);
        });
    }

    public function updateProperty(Property $property, array $data): Property
    {
        return DB::transaction(function () use ($property, $data) {
            $property->update($data);
            return $property->fresh();
        });
    }

    public function deleteProperty(Property $property): bool
    {
        return DB::transaction(function () use ($property) {
            $property->availability()->delete();
            $property->bookings()->where('status', 'pending')->update(['status' => 'rejected']);
            return $property->delete();
        });
    }

    public function manageAvailability(Property $property, array $availabilityData): void
    {
        DB::transaction(function () use ($property, $availabilityData) {
            foreach ($availabilityData as $availability) {
                PropertyAvailability::updateOrCreate(
                    [
                        'property_id' => $property->id,
                        'start_date' => $availability['start_date'],
                        'end_date' => $availability['end_date'],
                    ],
                    [
                        'is_available' => $availability['is_available'],
                    ]
                );
            }
        });
    }

    public function getAvailabilityForProperty(Property $property, ?string $startDate = null, ?string $endDate = null)
    {
        $query = $property->availability();

        if ($startDate) {
            $query->where('end_date', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('start_date', '<=', $endDate);
        }

        return $query->orderBy('start_date')->get();
    }

    public function checkAvailability(Property $property, string $startDate, string $endDate): bool
    {
        return $property->isAvailableForDates($startDate, $endDate);
    }

    public function getAllProperties(int $perPage = 10): LengthAwarePaginator
    {
        return Property::with(['city'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }
}
