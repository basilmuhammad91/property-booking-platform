<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Property;
use App\Models\User;
use App\Jobs\SendBookingConfirmationEmail;
use App\Exceptions\BookingException;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BookingService
{
    public function createBooking(User $user, int $propertyId, array $bookingData): Booking
    {
        logger("creating booking...");

        return DB::transaction(function () use ($user, $propertyId, $bookingData) {
            $property = Property::findOrFail($propertyId);

            $startDate = Carbon::parse($bookingData['start_date']);
            $endDate = Carbon::parse($bookingData['end_date']);

            if ($startDate->isPast()) {
                throw new BookingException('Cannot book dates in the past');
            }

            if ($startDate->gte($endDate)) {
                throw new BookingException('End date must be after start date');
            }

            if (!$property->isAvailableForDates($startDate, $endDate)) {
                throw new BookingException('Property is not available for the selected dates');
            }

            $nights = $startDate->diffInDays($endDate);
            $totalAmount = $nights * $property->price_per_night;

            return Booking::create([
                'user_id'      => $user->id,
                'property_id'  => $property->id,
                'start_date'   => $startDate,
                'end_date'     => $endDate,
                'nights'       => $nights,
                'total_amount' => $totalAmount,
                'status'       => 'pending',
            ]);
        });
    }

    public function confirmBooking(Booking $booking): Booking
    {
        return DB::transaction(function () use ($booking) {
            if (!$booking->isPending()) {
                throw new BookingException('Only pending bookings can be confirmed');
            }

            if (!$booking->property->isAvailableForDates($booking->start_date, $booking->end_date)) {
                throw new BookingException('Property is no longer available for the selected dates');
            }

            $booking->update(['status' => 'confirmed']);

            SendBookingConfirmationEmail::dispatch($booking);

            return $booking->fresh();
        });
    }

    public function rejectBooking(Booking $booking): Booking
    {
        return DB::transaction(function () use ($booking) {
            if (!$booking->isPending()) {
                throw new BookingException('Only pending bookings can be rejected');
            }

            $booking->update(['status' => 'rejected']);

            return $booking->fresh();
        });
    }

    public function cancelBooking(Booking $booking, User $user): Booking
    {
        return DB::transaction(function () use ($booking, $user) {
            if (!$booking->canBeCancelled()) {
                throw new BookingException('This booking cannot be cancelled');
            }

            if ($booking->user_id !== $user->id && !$user->isAdmin()) {
                throw new BookingException('Unauthorized to cancel this booking');
            }

            $booking->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
            ]);

            return $booking->fresh();
        });
    }

    public function getUserBookings(User $user, int $perPage = 10): LengthAwarePaginator
    {
        return $user->bookings()
            ->with(['property.city'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getAllBookings(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = Booking::query()
            ->with(['user', 'property.city']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['property_id'])) {
            $query->where('property_id', $filters['property_id']);
        }

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['start_date'])) {
            $query->whereDate('start_date', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('end_date', '<=', $filters['end_date']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getPropertyBookings(Property $property, int $perPage = 10): LengthAwarePaginator
    {
        return $property->bookings()
            ->with(['user'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getPendingBookings(int $perPage = 10): LengthAwarePaginator
    {
        return Booking::query()
            ->with(['user', 'property.city'])
            ->pending()
            ->orderBy('created_at', 'asc')
            ->paginate($perPage);
    }
}
