import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

export default function Show() {
  let { property, availability } = usePage().props;
  property = property?.data;

  const [selectedDates, setSelectedDates] = useState({
    checkIn: null,
    checkOut: null
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSelecting, setIsSelecting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalNights, setTotalNights] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const msPerDay = 1000 * 60 * 60 * 24;

  const processAvailability = () => {
    const availableDates = new Map();

    availability?.forEach(range => {
      if (range.is_available) {
        const start = new Date(range.start_date);
        const end = new Date(range.end_date);
        const rawPrice = range.price ?? property?.price_per_night;
        const price = Number(rawPrice);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toDateString();
          availableDates.set(dateStr, Number.isNaN(price) ? 0 : price);
        }
      }
    });

    return availableDates;
  };

  const availableDatesMap = processAvailability();

  const isDateAvailable = (date) => {
    return availableDatesMap.has(date.toDateString());
  };

  const getDatePrice = (date) => {
    const val = availableDatesMap.get(date.toDateString());
    const fallback = Number(property?.price_per_night) || 0;
    const num = Number(val ?? fallback);
    return Number.isNaN(num) ? fallback : num;
  };

  const isDateInRange = (date) => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return false;
    return date >= selectedDates.checkIn && date <= selectedDates.checkOut;
  };

  const isDateSelected = (date) => {
    const dateStr = date.toDateString();
    return dateStr === selectedDates.checkIn?.toDateString() ||
           dateStr === selectedDates.checkOut?.toDateString();
  };

  const handleDateClick = (date) => {
    if (!isDateAvailable(date)) return;

    if (!selectedDates.checkIn || (selectedDates.checkIn && selectedDates.checkOut)) {
      setSelectedDates({ checkIn: date, checkOut: null });
      setIsSelecting(true);
    } else if (selectedDates.checkIn && !selectedDates.checkOut) {
      if (date < selectedDates.checkIn) {
        setSelectedDates({ checkIn: date, checkOut: selectedDates.checkIn });
      } else {
        setSelectedDates({ ...selectedDates, checkOut: date });
      }
      setIsSelecting(false);
    }
  };

  const calculatePrice = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      setTotalPrice(0);
      setTotalNights(0);
      return;
    }

    const start = new Date(selectedDates.checkIn);
    const end = new Date(selectedDates.checkOut);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diff = end.getTime() - start.getTime();
    const nights = Math.max(0, Math.round(diff / msPerDay));

    let totalCost = 0;
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      totalCost += getDatePrice(d);
    }

    setTotalNights(nights);
    setTotalPrice(totalCost);
  };

  useEffect(() => {
    calculatePrice();
  }, [selectedDates]);

  const handleBooking = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return;

    router.post('/bookings', {
      property_id: property.id,
      start_date: selectedDates.checkIn.toISOString().split('T')[0],
      end_date: selectedDates.checkOut.toISOString().split('T')[0],
      total_price: totalPrice
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property?.images?.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property?.images?.length - 1 : prev - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative group rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg">
            {property?.images && property.images.length > 0 && (
              <>
                <div className="relative h-96 md:h-[500px] overflow-hidden">
                  <img
                    src={property.images[currentImageIndex]}
                    alt={property?.title ?? "Property Image"}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                      >
                        <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                      >
                        <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {property.images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  )}
                </div>

                {property.images.length > 1 && (
                  <div className="p-4">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {property.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => goToImage(idx)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            idx === currentImageIndex
                              ? 'border-pink-500 shadow-lg scale-105'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 shadow-lg">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {property?.title}
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">{property?.description}</p>

            <div className="flex items-center space-x-2 mb-6">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-slate-700 font-medium">Located in {property?.city?.name}</span>
            </div>

            {property?.amenities?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-3">
                  {property.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-pink-100 to-red-100 text-pink-700 rounded-full text-sm font-medium border border-pink-200"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg">
            <div className="mb-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                  ${property?.price_per_night}
                </span>
                <span className="text-slate-500">/ night</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">Base price (may vary by date)</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Select Dates</h3>

              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h4 className="text-lg font-semibold">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h4>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentMonth).map((date, idx) => {
                  if (!date) {
                    return <div key={idx} className="h-10" />;
                  }

                  const isAvailable = isDateAvailable(date);
                  const isSelected = isDateSelected(date);
                  const isInRange = isDateInRange(date);
                  const isPast = date < today;
                  const datePrice = getDatePrice(date);
                  const hasCustomPrice = datePrice !== Number(property?.price_per_night);

                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateClick(date)}
                      disabled={!isAvailable || isPast}
                      className={`
                        relative h-10 text-sm rounded-lg transition-all duration-200 flex flex-col items-center justify-center
                        ${isPast
                          ? 'text-slate-300 cursor-not-allowed'
                          : isAvailable
                            ? isSelected
                              ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold shadow-lg'
                              : isInRange
                                ? 'bg-gradient-to-r from-pink-100 to-red-100 text-pink-700'
                                : 'hover:bg-slate-100 text-slate-700 cursor-pointer'
                            : 'text-slate-300 cursor-not-allowed'
                        }
                      `}
                    >
                      <span className={`text-xs ${isSelected ? 'text-white' : ''}`}>
                        {date.getDate()}
                      </span>
                      {isAvailable && hasCustomPrice && (
                        <span className={`text-[10px] leading-none ${isSelected ? 'text-white/90' : 'text-pink-600'}`}>
                          ${datePrice}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDates.checkIn && (
              <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-xl border border-pink-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Check-in:</span>
                    <span className="font-medium">{formatDate(selectedDates.checkIn)}</span>
                  </div>
                  {selectedDates.checkOut && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Check-out:</span>
                        <span className="font-medium">{formatDate(selectedDates.checkOut)}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-pink-200">
                        <span className="text-slate-600">{totalNights} nights:</span>
                        <span className="font-bold text-pink-600">${totalPrice}</span>
                      </div>
                      {totalNights > 0 && (
                        <div className="text-xs text-slate-500">
                          Avg: ${Math.round(totalPrice / totalNights)}/night
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={!selectedDates.checkIn || !selectedDates.checkOut}
              className={`
                w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform
                ${selectedDates.checkIn && selectedDates.checkOut
                  ? 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 hover:scale-105 shadow-lg hover:shadow-xl'
                  : 'bg-slate-300 cursor-not-allowed'
                }
              `}
            >
              {selectedDates.checkIn && selectedDates.checkOut
                ? `Book Now - $${totalPrice}`
                : 'Select Dates to Book'
              }
            </button>

            <p className="text-xs text-slate-500 text-center mt-3">
              You won't be charged yet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

Show.layout = (page) => <AppLayout children={page} />;
