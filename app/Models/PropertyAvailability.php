<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyAvailability extends Model
{

    protected $table = 'property_availability';

    protected $fillable = [
        'property_id',
        'start_date',
        'end_date',
        'is_available',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_available' => 'boolean',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
