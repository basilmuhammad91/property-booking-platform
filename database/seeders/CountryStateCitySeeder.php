<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Country;
use App\Models\State;
use App\Models\City;

class CountryStateCitySeeder extends Seeder
{
    public function run(): void
    {
        $pakistan = Country::firstOrCreate(['name' => 'Pakistan']);

        $punjab = State::firstOrCreate(['name' => 'Punjab', 'country_id' => $pakistan->id]);
        $sindh = State::firstOrCreate(['name' => 'Sindh', 'country_id' => $pakistan->id]);
        $kpk = State::firstOrCreate(['name' => 'Khyber Pakhtunkhwa', 'country_id' => $pakistan->id]);
        $balochistan = State::firstOrCreate(['name' => 'Balochistan', 'country_id' => $pakistan->id]);
        $islamabad = State::firstOrCreate(['name' => 'Islamabad Capital Territory', 'country_id' => $pakistan->id]);

        City::firstOrCreate(['name' => 'Lahore', 'state_id' => $punjab->id]);
        City::firstOrCreate(['name' => 'Faisalabad', 'state_id' => $punjab->id]);
        City::firstOrCreate(['name' => 'Rawalpindi', 'state_id' => $punjab->id]);

        City::firstOrCreate(['name' => 'Karachi', 'state_id' => $sindh->id]);
        City::firstOrCreate(['name' => 'Hyderabad', 'state_id' => $sindh->id]);
        City::firstOrCreate(['name' => 'Sukkur', 'state_id' => $sindh->id]);

        City::firstOrCreate(['name' => 'Peshawar', 'state_id' => $kpk->id]);
        City::firstOrCreate(['name' => 'Abbottabad', 'state_id' => $kpk->id]);
        City::firstOrCreate(['name' => 'Mardan', 'state_id' => $kpk->id]);

        City::firstOrCreate(['name' => 'Quetta', 'state_id' => $balochistan->id]);
        City::firstOrCreate(['name' => 'Gwadar', 'state_id' => $balochistan->id]);
        City::firstOrCreate(['name' => 'Turbat', 'state_id' => $balochistan->id]);

        City::firstOrCreate(['name' => 'Islamabad', 'state_id' => $islamabad->id]);

        $saudi = Country::firstOrCreate(['name' => 'Saudi Arabia']);

        $riyadhProvince = State::firstOrCreate(['name' => 'Riyadh Province', 'country_id' => $saudi->id]);
        $makkahProvince = State::firstOrCreate(['name' => 'Makkah Province', 'country_id' => $saudi->id]);
        $easternProvince = State::firstOrCreate(['name' => 'Eastern Province', 'country_id' => $saudi->id]);
        $medinaProvince = State::firstOrCreate(['name' => 'Medina Province', 'country_id' => $saudi->id]);

        City::firstOrCreate(['name' => 'Riyadh', 'state_id' => $riyadhProvince->id]);
        City::firstOrCreate(['name' => 'Al Kharj', 'state_id' => $riyadhProvince->id]);

        City::firstOrCreate(['name' => 'Jeddah', 'state_id' => $makkahProvince->id]);
        City::firstOrCreate(['name' => 'Makkah', 'state_id' => $makkahProvince->id]);
        City::firstOrCreate(['name' => 'Taif', 'state_id' => $makkahProvince->id]);

        City::firstOrCreate(['name' => 'Dammam', 'state_id' => $easternProvince->id]);
        City::firstOrCreate(['name' => 'Khobar', 'state_id' => $easternProvince->id]);
        City::firstOrCreate(['name' => 'Dhahran', 'state_id' => $easternProvince->id]);

        City::firstOrCreate(['name' => 'Medina', 'state_id' => $medinaProvince->id]);
        City::firstOrCreate(['name' => 'Yanbu', 'state_id' => $medinaProvince->id]);
    }
}
