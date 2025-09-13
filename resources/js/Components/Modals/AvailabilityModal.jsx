import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Calendar, Plus, Trash2, Check, X, AlertCircle } from "lucide-react";

export default function AvailabilityModal({ show, onClose, property }) {
    const [availabilities, setAvailabilities] = useState([]);
    const [newAvailability, setNewAvailability] = useState({
        start_date: '',
        end_date: '',
        is_available: true
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (show && property) {
            // Fetch existing availability data
            fetchAvailability();
        }
    }, [show, property]);

    const fetchAvailability = () => {
        setLoading(true);
        router.get(route('admin.properties.availability', property.id), {}, {
            onSuccess: (page) => {
                setAvailabilities(page.props.availabilities || []);
            },
            onError: (errors) => {
                console.error('Failed to fetch availability:', errors);
            },
            onFinish: () => setLoading(false),
            preserveScroll: true,
            preserveState: true,
            only: ['availabilities']
        });
    };

    const validateDates = (startDate, endDate) => {
        const errors = {};
        const today = new Date().toISOString().split('T')[0];

        if (!startDate) errors.start_date = 'Start date is required';
        if (!endDate) errors.end_date = 'End date is required';

        if (startDate && startDate < today) {
            errors.start_date = 'Start date cannot be in the past';
        }

        if (startDate && endDate && startDate > endDate) {
            errors.end_date = 'End date must be after start date';
        }

        // Check for overlapping dates
        const hasOverlap = availabilities.some(availability =>
            (startDate >= availability.start_date && startDate <= availability.end_date) ||
            (endDate >= availability.start_date && endDate <= availability.end_date) ||
            (startDate <= availability.start_date && endDate >= availability.end_date)
        );

        if (hasOverlap) {
            errors.overlap = 'Date range overlaps with existing availability period';
        }

        return errors;
    };

    const handleAddAvailability = () => {
        const validationErrors = validateDates(newAvailability.start_date, newAvailability.end_date);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setAvailabilities(prev => [...prev, {
            id: `temp-${Date.now()}`,
            ...newAvailability,
            isNew: true
        }]);

        setNewAvailability({
            start_date: '',
            end_date: '',
            is_available: true
        });
        setErrors({});
    };

    const handleRemoveAvailability = (id) => {
        setAvailabilities(prev => prev.filter(availability => availability.id !== id));
    };

    const handleToggleAvailability = (id) => {
        setAvailabilities(prev =>
            prev.map(availability =>
                availability.id === id
                    ? { ...availability, is_available: !availability.is_available }
                    : availability
            )
        );
    };

    const handleSubmit = () => {
        if (availabilities.length === 0) {
            setErrors({ submit: 'Please add at least one availability period' });
            return;
        }

        setLoading(true);

        const availabilityData = availabilities.map(({ id, isNew, ...availability }) => availability);

        router.post(route('admin.properties.manage-availability', property.id), {
            availability: availabilityData
        }, {
            onSuccess: () => {
                onClose();
                setAvailabilities([]);
                setErrors({});
            },
            onError: (errors) => {
                setErrors(errors);
            },
            onFinish: () => setLoading(false)
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysDifference = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    if (!show || !property) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 bg-white shadow-2xl rounded-2xl mx-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Manage Availability</h2>
                        <p className="text-gray-600">{property.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-2 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Add New Availability */}
                <div className="p-6 mb-6 rounded-lg bg-gray-50">
                    <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                        <Plus className="w-5 h-5 mr-2" />
                        Add Availability Period
                    </h3>

                    <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={newAvailability.start_date}
                                onChange={(e) => setNewAvailability(prev => ({
                                    ...prev,
                                    start_date: e.target.value
                                }))}
                                min={new Date().toISOString().split('T')[0]}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.start_date ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.start_date && (
                                <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={newAvailability.end_date}
                                onChange={(e) => setNewAvailability(prev => ({
                                    ...prev,
                                    end_date: e.target.value
                                }))}
                                min={newAvailability.start_date || new Date().toISOString().split('T')[0]}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.end_date ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.end_date && (
                                <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                value={newAvailability.is_available}
                                onChange={(e) => setNewAvailability(prev => ({
                                    ...prev,
                                    is_available: e.target.value === 'true'
                                }))}
                                className="w-full px-3 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value={true}>Available</option>
                                <option value={false}>Blocked</option>
                            </select>
                        </div>
                    </div>

                    {errors.overlap && (
                        <div className="flex items-center p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
                            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                            <p className="text-sm text-red-700">{errors.overlap}</p>
                        </div>
                    )}

                    <button
                        onClick={handleAddAvailability}
                        disabled={!newAvailability.start_date || !newAvailability.end_date}
                        className="inline-flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Period
                    </button>
                </div>

                {/* Existing Availability List */}
                <div className="mb-6">
                    <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                        <Calendar className="w-5 h-5 mr-2" />
                        Availability Periods ({availabilities.length})
                    </h3>

                    {loading && (
                        <div className="py-8 text-center">
                            <div className="inline-block w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                            <p className="mt-2 text-gray-600">Loading availability data...</p>
                        </div>
                    )}

                    {!loading && availabilities.length === 0 && (
                        <div className="py-8 text-center rounded-lg bg-gray-50">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p className="text-gray-600">No availability periods set</p>
                            <p className="text-sm text-gray-500">Add your first availability period above</p>
                        </div>
                    )}

                    {!loading && availabilities.length > 0 && (
                        <div className="space-y-3 overflow-y-auto max-h-60">
                            {availabilities.map((availability) => (
                                <div
                                    key={availability.id}
                                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                                        availability.isNew
                                            ? 'bg-blue-50 border-blue-200'
                                            : 'bg-white border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium text-gray-900">
                                                    {formatDate(availability.start_date)} - {formatDate(availability.end_date)}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    ({getDaysDifference(availability.start_date, availability.end_date)} days)
                                                </span>
                                                {availability.isNew && (
                                                    <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleToggleAvailability(availability.id)}
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                                availability.is_available
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                            }`}
                                        >
                                            {availability.is_available ? (
                                                <>
                                                    <Check className="w-3 h-3 mr-1" />
                                                    Available
                                                </>
                                            ) : (
                                                <>
                                                    <X className="w-3 h-3 mr-1" />
                                                    Blocked
                                                </>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => handleRemoveAvailability(availability.id)}
                                            className="p-1 text-red-600 transition-colors rounded hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {errors.submit && (
                    <div className="flex items-center p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
                        <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                        <p className="text-sm text-red-700">{errors.submit}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end pt-4 space-x-3 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-2 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || availabilities.length === 0}
                        className="px-6 py-2 font-medium text-white transition-all transform rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 disabled:opacity-50 disabled:transform-none"
                    >
                        {loading ? (
                            <>
                                <div className="inline-block w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : (
                            'Save Availability'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
