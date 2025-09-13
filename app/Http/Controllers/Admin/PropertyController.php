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
            ],
            'cities' => $cities,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price_per_night' => ['required', 'numeric', 'min:1'],
            'city_id' => ['required', 'exists:cities,id'],
            'images' => ['nullable', 'array', 'max:5'], // max 5 images
            'images.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'], // 2MB each
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['string', 'max:50'],
            'is_active' => ['boolean'],
        ]);

        $property = $this->propertyService->createProperty($validated);

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

    public function update(Request $request, Property $property)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price_per_night' => ['required', 'numeric', 'min:1'],
            'city_id' => ['required', 'exists:cities,id'],
            'images' => ['nullable', 'array', 'max:5'],
            'images.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'existing_images' => ['nullable', 'array'],
            'existing_images.*' => ['string'],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['string', 'max:50'],
            'is_active' => ['boolean'],
        ]);

        // Handle existing images
        $existingImages = $validated['existing_images'] ?? [];

        // Handle new image uploads
        $newImagePaths = [];
        if (isset($validated['images'])) {
            foreach ($validated['images'] as $image) {
                $path = $image->store('properties', 'public');
                $newImagePaths[] = '/storage/' . $path;
            }
        }

        // Combine existing and new images
        $allImages = array_merge($existingImages, $newImagePaths);

        $validated['images'] = json_encode($allImages);
        $validated['amenities'] = json_encode($validated['amenities'] ?? []);
        $validated['is_active'] = $validated['is_active'] ?? $property->is_active;

        // Remove the arrays we don't want to save directly
        unset($validated['existing_images']);

        $property->update($validated);

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
