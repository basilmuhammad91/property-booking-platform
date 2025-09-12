<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Property;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    protected BookingService $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
        $this->middleware('admin');
    }

    public function index(Request $request): JsonResponse
    {
        $bookings = $this->bookingService->getAllBookings(
            $request->only(['status', 'property_id', 'user_id', 'start_date', 'end_date']),
            $request->get('per_page', 10)
        );

        return response()->json([
            'data' => BookingResource::collection($bookings),
            'meta' => [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
            ],
        ]);
    }

    public function pending(Request $request): JsonResponse
    {
        $bookings = $this->bookingService->getPendingBookings(
            $request->get('per_page', 10)
        );

        return response()->json([
            'data' => BookingResource::collection($bookings),
            'meta' => [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
            ],
        ]);
    }

    public function propertyBookings(Request $request, Property $property): JsonResponse
    {
        $bookings = $this->bookingService->getPropertyBookings(
            $property,
            $request->get('per_page', 10)
        );

        return response()->json([
            'data' => BookingResource::collection($bookings),
            'meta' => [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
            ],
        ]);
    }

    public function show(Booking $booking): JsonResponse
    {
        return response()->json([
            'data' => new BookingResource($booking->load(['property.city', 'user'])),
        ]);
    }
}
