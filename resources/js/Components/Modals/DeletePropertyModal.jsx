import React from "react";
import { router } from "@inertiajs/react";

export default function DeletePropertyModal({ show, onClose, propertyId }) {
    const handleDelete = () => {
        router.delete(route("admin.properties.destroy", propertyId), {
            onSuccess: () => onClose(),
        });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6">
                <h2 className="text-lg font-semibold mb-4">
                    Are you sure you want to delete this property?
                </h2>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-200 rounded-lg text-slate-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
