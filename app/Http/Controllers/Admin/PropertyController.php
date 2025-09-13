<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AvailabilityRequest;
use App\Http\Requests\PropertyRequest;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use App\Services\PropertyService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\City;

class PropertyController extends Controller
{
    protected PropertyService $propertyService;

    public function __construct(PropertyService $propertyService)
    {
        $this->propertyService = $propertyService;
        $this->middleware('role:admin');
    }

    public function index(Request $request): Response
    {
        logger("test property index...");

        $properties = $this->propertyService->getAllProperties(
            $request->get('per_page', 10)
        );

            $cities = City::select('id', 'name')->get();

        return Inertia::render('Admin/Properties/Index', [
            'properties' => PropertyResource::collection($properties),
            'meta' => [
                'current_page' => $properties->currentPage(),
                'last_page' => $properties->lastPage(),
                'per_page' => $properties->perPage(),
                'total' => $properties->total(),
                'cities' => $cities,
            ],
        ]);
    }

    public function store(PropertyRequest $request)
    {
        $property = $this->propertyService->createProperty($request->validated());

        return redirect()
            ->route('admin.properties.index')
            ->with('success', 'Property created successfully');
    }

    public function show(Property $property): Response
    {
        $property->load(['city', 'availability', 'bookings.user']);

        return Inertia::render('Admin/Properties/Show', [
            'property' => new PropertyResource($property),
        ]);
    }

    public function update(PropertyRequest $request, Property $property)
    {
        $this->propertyService->updateProperty($property, $request->validated());

        return redirect()
            ->route('admin.properties.index')
            ->with('success', 'Property updated successfully');
    }

    public function destroy(Property $property)
    {
        $this->propertyService->deleteProperty($property);

        return redirect()
            ->route('admin.properties.index')
            ->with('success', 'Property deleted successfully');
    }

    public function manageAvailability(AvailabilityRequest $request, Property $property)
    {
        $this->propertyService->manageAvailability($property, $request->validated()['availability']);

        return redirect()
            ->route('admin.properties.show', $property->id)
            ->with('success', 'Property availability updated successfully');
    }

    public function getAvailability(Request $request, Property $property): Response
    {
        $availability = $this->propertyService->getAvailabilityForProperty(
            $property,
            $request->get('start_date'),
            $request->get('end_date')
        );

        return Inertia::render('Admin/Properties/Availability', [
            'property' => new PropertyResource($property),
            'availability' => $availability,
        ]);
    }
}
