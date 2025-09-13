<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Property;
use App\Services\BookingService;
use App\Exceptions\BookingException;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    protected BookingService $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    public function index(Request $request)
    {
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

        return Inertia::render('Bookings/Index', [
            'bookings' => BookingResource::collection($bookings),
            'filters' => $request->only(['status', 'property_id', 'user_id', 'start_date', 'end_date']),
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

            return redirect()->route('bookings.index')->with('success', 'Booking created successfully');
        } catch (BookingException $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function show(Booking $booking)
    {
        $this->authorize('view', $booking);

        return Inertia::render('Bookings/Show', [
            'booking' => new BookingResource($booking->load(['property.city', 'user'])),
        ]);
    }

    public function confirm(Booking $booking)
    {
        $this->authorize('update', $booking);

        try {
            $booking = $this->bookingService->confirmBooking($booking);

            return redirect()->route('bookings.index')->with('success', 'Booking confirmed successfully');
        } catch (BookingException $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function reject(Booking $booking)
    {
        $this->authorize('update', $booking);

        try {
            $booking = $this->bookingService->rejectBooking($booking);

            return redirect()->route('bookings.index')->with('success', 'Booking rejected successfully');
        } catch (BookingException $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function cancel(Booking $booking)
    {
        try {
            $booking = $this->bookingService->cancelBooking($booking, auth()->user());

            return redirect()->route('bookings.index')->with('success', 'Booking cancelled successfully');
        } catch (BookingException $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
