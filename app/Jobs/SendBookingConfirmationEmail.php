<?php

namespace App\Jobs;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendBookingConfirmationEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $booking;

    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    public function handle(): void
    {
        Log::info('Sending booking confirmation email', [
            'booking_id' => $this->booking->id,
            'user_email' => $this->booking->user->email,
            'property_title' => $this->booking->property->title,
        ]);

        Log::info('Booking confirmation email sent successfully', [
            'booking_id' => $this->booking->id,
        ]);
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Failed to send booking confirmation email', [
            'booking_id' => $this->booking->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
