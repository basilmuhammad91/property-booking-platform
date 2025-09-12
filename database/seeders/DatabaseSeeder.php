<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Property;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RoleAndAdminSeeder::class);
        $this->call(CountryStateCitySeeder::class);
        Property::factory()->count(500)->create();
    }
}
