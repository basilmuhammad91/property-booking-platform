import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function CreatePropertyModal({ show, onClose, cities }) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        price_per_night: "",
        city_id: "",
        images: [],
        amenities: [],
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [dragActive, setDragActive] = useState(false);

    const amenitiesOptions = ['WiFi', 'Air Conditioning', 'Parking', 'Pool', 'TV', 'Kitchen', 'Heating', 'Balcony', 'Gym', 'Laundry'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAmenityToggle = (amenity) => {
        setForm((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleImageSelect = (files) => {
        const fileList = Array.from(files);
        if (selectedImages.length + fileList.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        const newImages = fileList.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            id: Math.random().toString(36)
        }));

        setSelectedImages(prev => [...prev, ...newImages]);
        setForm(prev => ({ ...prev, images: [...prev.images, ...fileList] }));
    };

    const handleFileChange = (e) => {
        handleImageSelect(e.target.files);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageSelect(e.dataTransfer.files);
        }
    };

    const removeImage = (id) => {
        const imageToRemove = selectedImages.find(img => img.id === id);
        if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.preview);
        }

        setSelectedImages(prev => prev.filter(img => img.id !== id));
        setForm(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => selectedImages[index]?.id !== id)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("price_per_night", form.price_per_night);
        formData.append("city_id", form.city_id);

        form.amenities.forEach((amenity, index) => {
            formData.append(`amenities[${index}]`, amenity);
        });

        form.images.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        router.post(route("admin.properties.store"), formData, {
            onSuccess: () => {
                selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
                onClose();
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            }
        });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white shadow-2xl rounded-2xl mx-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Property Title</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Beautiful apartment in downtown"
                            className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe your property..."
                            className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="4"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Price per Night ($)</label>
                            <input
                                type="number"
                                name="price_per_night"
                                value={form.price_per_night}
                                onChange={handleChange}
                                placeholder="100"
                                min="1"
                                className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">City</label>
                            <select
                                name="city_id"
                                value={form.city_id}
                                onChange={handleChange}
                                className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select City</option>
                                {cities?.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-3 text-sm font-medium text-gray-700">Amenities</label>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                            {amenitiesOptions.map((amenity) => (
                                <label
                                    key={amenity}
                                    className={`flex items-center px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                                        form.amenities.includes(amenity)
                                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.amenities.includes(amenity)}
                                        onChange={() => handleAmenityToggle(amenity)}
                                        className="sr-only"
                                    />
                                    <span className="text-sm font-medium">{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-3 text-sm font-medium text-gray-700">
                            Images (Max 5) <span className="text-gray-500">- {selectedImages.length}/5</span>
                        </label>

                        <div
                            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                dragActive
                                    ? 'border-blue-400 bg-blue-50'
                                    : selectedImages.length >= 5
                                    ? 'border-gray-200 bg-gray-50'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {selectedImages.length < 5 ? (
                                <>
                                    <svg className="w-12 h-12 mx-auto text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="mt-4">
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <span className="block mt-2 text-sm font-medium text-gray-900">
                                                Drop images here or click to upload
                                            </span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                multiple
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="mt-1 text-xs text-gray-500">PNG, JPG, JPEG, WebP up to 2MB each</p>
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-500">Maximum images reached</p>
                            )}
                        </div>

                        {selectedImages.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-3">
                                {selectedImages.map((image) => (
                                    <div key={image.id} className="relative group">
                                        <img
                                            src={image.preview}
                                            alt="Preview"
                                            className="object-cover w-full h-24 border border-gray-200 rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(image.id)}
                                            className="absolute p-1 text-white transition-opacity bg-red-500 rounded-full opacity-0 -top-2 -right-2 group-hover:opacity-100"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4 space-x-3 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-6 py-2 font-medium text-white transition-all transform rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105"
                        >
                            Create Property
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
