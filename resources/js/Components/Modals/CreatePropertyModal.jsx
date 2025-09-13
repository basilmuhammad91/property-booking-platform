import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function CreatePropertyModal({ show, onClose, cities }) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        price_per_night: "",
        city_id: "",
        images: [],
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setForm((prev) => ({ ...prev, [name]: Array.from(files) }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("price_per_night", form.price_per_night);
        formData.append("city_id", form.city_id);

        form.images.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        router.post(route("admin.properties.store"), formData, {
            onSuccess: () => onClose(),
        });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-2xl">
                <h2 className="mb-4 text-xl font-bold">Add New Property</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Title"
                        className="w-full px-3 py-2 border rounded-lg border-slate-300"
                        required
                    />
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="w-full px-3 py-2 border rounded-lg border-slate-300"
                        rows="3"
                        required
                    />
                    <input
                        type="number"
                        name="price_per_night"
                        value={form.price_per_night}
                        onChange={handleChange}
                        placeholder="Price per night"
                        className="w-full px-3 py-2 border rounded-lg border-slate-300"
                        required
                    />
                    <select
                        name="city_id"
                        value={form.city_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg border-slate-300"
                        required
                    >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="file"
                        name="images"
                        multiple
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg border-slate-300"
                    />

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white rounded-lg shadow bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
