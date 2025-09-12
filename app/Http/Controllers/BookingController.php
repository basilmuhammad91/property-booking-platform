<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Property;
use App\Services\BookingService;
use App\Exceptions\BookingException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    protected BookingService $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    public function index(Request $request): JsonResponse
    {
        logger(200000000000);
        $user = auth()->user();

        if ($user->isAdmin()) {
            $bookings = $this->bookingService->getAllBookings(
                $request->only(['status', 'property_id', 'user_id', 'start_date', 'end_date']),
                $request->get('per_page', 10)
            );
        } else {
            $bookings = $this->bookingService->getUserBookings(
                $user,
                $request->get('per_page', 10)
            );
        }

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

    public function store(Request $request)
    {
        logger("storing booking...");

        try {
            $validated = $request->validate([
                'property_id' => ['required', 'exists:properties,id'],
                'start_date' => ['required', 'date', 'after_or_equal:today'],
                'end_date' => ['required', 'date', 'after:start_date'],
            ]);

            $booking = $this->bookingService->createBooking(
                auth()->user(),
                $validated['property_id'],
                $validated
            );

            return redirect()->back()->with('success', 'Booking created successfully');
        } catch (BookingException $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function show(Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);

        return response()->json([
            'data' => new BookingResource($booking->load(['property.city', 'user'])),
        ]);
    }

    public function confirm(Booking $booking): JsonResponse
    {
        $this->authorize('update', $booking);

        try {
            $booking = $this->bookingService->confirmBooking($booking);

            return response()->json([
                'message' => 'Booking confirmed successfully',
                'data' => new BookingResource($booking),
            ]);
        } catch (BookingException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function reject(Booking $booking): JsonResponse
    {
        $this->authorize('update', $booking);

        try {
            $booking = $this->bookingService->rejectBooking($booking);

            return response()->json([
                'message' => 'Booking rejected successfully',
                'data' => new BookingResource($booking),
            ]);
        } catch (BookingException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function cancel(Booking $booking): JsonResponse
    {
        try {
            $booking = $this->bookingService->cancelBooking($booking, auth()->user());

            return response()->json([
                'message' => 'Booking cancelled successfully',
                'data' => new BookingResource($booking),
            ]);
        } catch (BookingException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
