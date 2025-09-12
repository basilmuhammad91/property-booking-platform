<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AvailabilityRequest;
use App\Http\Requests\PropertyRequest;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use App\Services\PropertyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    protected PropertyService $propertyService;

    public function __construct(PropertyService $propertyService)
    {
        $this->propertyService = $propertyService;
        $this->middleware('admin');
    }

    public function index(Request $request): JsonResponse
    {
        $properties = $this->propertyService->getAllProperties(
            $request->get('per_page', 10)
        );

        return response()->json([
            'data' => PropertyResource::collection($properties),
            'meta' => [
                'current_page' => $properties->currentPage(),
                'last_page' => $properties->lastPage(),
                'per_page' => $properties->perPage(),
                'total' => $properties->total(),
            ],
        ]);
    }

    public function store(PropertyRequest $request): JsonResponse
    {
        $property = $this->propertyService->createProperty($request->validated());

        return response()->json([
            'message' => 'Property created successfully',
            'data' => new PropertyResource($property),
        ], 201);
    }

    public function show(Property $property): JsonResponse
    {
        return response()->json([
            'data' => new PropertyResource($property->load(['city', 'availability', 'bookings.user'])),
        ]);
    }

    public function update(PropertyRequest $request, Property $property): JsonResponse
    {
        $property = $this->propertyService->updateProperty($property, $request->validated());

        return response()->json([
            'message' => 'Property updated successfully',
            'data' => new PropertyResource($property),
        ]);
    }

    public function destroy(Property $property): JsonResponse
    {
        $this->propertyService->deleteProperty($property);

        return response()->json([
            'message' => 'Property deleted successfully',
        ]);
    }

    public function manageAvailability(AvailabilityRequest $request, Property $property): JsonResponse
    {
        $this->propertyService->manageAvailability($property, $request->validated()['availability']);

        return response()->json([
            'message' => 'Property availability updated successfully',
        ]);
    }

    public function getAvailability(Request $request, Property $property): JsonResponse
    {
        $availability = $this->propertyService->getAvailabilityForProperty(
            $property,
            $request->get('start_date'),
            $request->get('end_date')
        );

        return response()->json([
            'data' => $availability,
        ]);
    }
}
