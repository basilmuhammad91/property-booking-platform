import React from "react";
import { usePage, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { useToast } from "@/Components/ToastProvider";
import useAuth from "@/Hooks/useAuth";

export default function Index() {
    const { bookings, meta } = usePage().props;
    const { addToast } = useToast();
    const { user } = useAuth() ?? {};

    const handleAction = (id, action) => {
        let url = `/bookings/${id}/${action}`;

        router.post(
            url,
            {},
            {
                onSuccess: () => {
                    addToast(`Booking ${action}ed successfully!`, "success");
                },
                onError: (errors) => {
                    addToast(
                        errors?.message || "Something went wrong!",
                        "error"
                    );
                },
            }
        );
    };

    return (
        <div className="px-6 py-10 mx-auto max-w-7xl">
            <h1 className="mb-8 text-4xl font-bold text-transparent bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
                My Bookings
            </h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bookings?.data?.map((booking) => (
                    <div
                        key={booking.id}
                        className="flex flex-col justify-between p-6 border shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/50"
                    >
                        <div>
                            <h2 className="mb-2 text-xl font-semibold text-slate-800">
                                {booking.property?.title}
                            </h2>
                            <p className="mb-1 text-sm text-slate-600">
                                {booking.property?.city?.name}
                            </p>

                            {/* Show booked user name only if admin */}
                            {usePage().props?.auth?.user?.is_admin &&
                                booking?.user?.name && (
                                    <p className="mb-1 text-sm text-slate-700">
                                        Booked by:{" "}
                                        <span className="font-medium">
                                            {booking.user.name}
                                        </span>
                                    </p>
                                )}

                            <p className="mb-1 text-sm text-slate-500">
                                Check-in:{" "}
                                <span className="font-medium">
                                    {booking.start_date}
                                </span>
                            </p>
                            <p className="mb-3 text-sm text-slate-500">
                                Check-out:{" "}
                                <span className="font-medium">
                                    {booking.end_date}
                                </span>
                            </p>
                            <p
                                className={`inline-block px-3 py-1 text-sm rounded-full mb-3 ${
                                    booking.status === "confirmed"
                                        ? "bg-green-100 text-green-700"
                                        : booking.status === "rejected"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                                {booking.status}
                            </p>
                            <p className="text-lg font-bold text-pink-600">
                                ${booking.total_amount}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex mt-4 space-x-2">
                            {usePage().props?.auth?.user?.is_admin ? (
                                <>
                                    {booking.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleAction(
                                                        booking.id,
                                                        "confirm"
                                                    )
                                                }
                                                className="px-4 py-2 text-sm font-semibold text-white shadow-md rounded-xl bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleAction(
                                                        booking.id,
                                                        "reject"
                                                    )
                                                }
                                                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-200 rounded-xl hover:bg-slate-300"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    {booking.status === "pending" && (
                                        <button
                                            onClick={() =>
                                                handleAction(
                                                    booking.id,
                                                    "cancel"
                                                )
                                            }
                                            className="px-4 py-2 text-sm font-semibold text-white shadow-md rounded-xl bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {meta?.last_page > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                    {Array.from({ length: meta.last_page }, (_, idx) => (
                        <button
                            key={idx}
                            onClick={() =>
                                router.get(
                                    route("bookings.index", { page: idx + 1 })
                                )
                            }
                            className={`px-4 py-2 rounded-lg ${
                                meta.current_page === idx + 1
                                    ? "bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

Index.layout = (page) => <AppLayout children={page} />;
