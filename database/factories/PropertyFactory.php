<?php

namespace Database\Factories;

use App\Models\City;
use App\Models\PropertyAvailability;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class PropertyFactory extends Factory
{
    public function definition(): array
    {
        $amenitiesOptions = ['WiFi', 'Air Conditioning', 'Parking', 'Pool', 'TV', 'Kitchen', 'Heating'];
        $amenities = $this->faker->randomElements($amenitiesOptions, rand(2, 4));

        $images = [
            "https://picsum.photos/600/400?random=" . $this->faker->unique()->numberBetween(1, 500),
            "https://picsum.photos/600/400?random=" . $this->faker->unique()->numberBetween(501, 1000),
            "https://picsum.photos/600/400?random=" . $this->faker->unique()->numberBetween(1001, 1500),
        ];

        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'price_per_night' => $this->faker->numberBetween(50, 500),
            'city_id' => City::inRandomOrder()->first()->id ?? 1,
            'amenities' => json_encode($amenities),
            'images' => json_encode($images),
            'is_active' => true,
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function ($property) {
            // Make the property available for the next 6 months
            $startDate = Carbon::now()->startOfDay();
            $endDate = $startDate->copy()->addMonths(6)->endOfDay();

            PropertyAvailability::create([
                'property_id' => $property->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'price' => $property->price_per_night,
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });
    }
}
