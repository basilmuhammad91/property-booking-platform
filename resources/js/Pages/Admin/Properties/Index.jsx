import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import CreatePropertyModal from "@/Components/Modals/CreatePropertyModal";
import EditPropertyModal from "@/Components/Modals/EditPropertyModal";
import AvailabilityModal from "@/Components/Modals/AvailabilityModal";
import DeletePropertyModal from "@/Components/Modals/DeletePropertyModal";
import { Plus, Pencil, Trash2, MapPin, DollarSign, Calendar, Image, Clock } from "lucide-react";

export default function Index() {
  const { properties, cities } = usePage().props;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [editProperty, setEditProperty] = useState(null);
  const [availabilityProperty, setAvailabilityProperty] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const handleEditClick = (property) => {
    setEditProperty(property);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setEditProperty(null);
  };

  const handleAvailabilityClick = (property) => {
    setAvailabilityProperty(property);
    setShowAvailabilityModal(true);
  };

  const handleAvailabilityClose = () => {
    setShowAvailabilityModal(false);
    setAvailabilityProperty(null);
  };

  const getImageCount = (images) => {
    if (!images) return 0;
    try {
      const parsed = typeof images === 'string' ? JSON.parse(images) : images;
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  };

  const getAmenityCount = (amenities) => {
    if (!amenities) return 0;
    try {
      const parsed = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
            Manage Properties
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your property listings and reservations
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-5 py-3 font-semibold text-white transition-all transform shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Property
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <div className="p-6 border shadow-lg bg-white/80 backdrop-blur-sm border-slate-200/50 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Properties</p>
              <p className="text-3xl font-bold text-slate-800">{properties.data.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="p-6 border shadow-lg bg-white/80 backdrop-blur-sm border-slate-200/50 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Listings</p>
              <p className="text-3xl font-bold text-green-600">
                {properties.data.filter(p => p.is_active).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="p-6 border shadow-lg bg-white/80 backdrop-blur-sm border-slate-200/50 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Price/Night</p>
              <p className="text-3xl font-bold text-purple-600">
                ${Math.round(properties.data.reduce((sum, p) => sum + p.price_per_night, 0) / properties.data.length || 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.data.map((property) => (
          <div
            key={property.id}
            className="overflow-hidden transition-all duration-300 border shadow-lg bg-white/80 backdrop-blur-sm border-slate-200/50 rounded-2xl hover:shadow-xl group"
          >
            <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
              {property.images && getImageCount(property.images) > 0 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
                  <div className="text-center text-gray-500">
                    <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{getImageCount(property.images)} Images</p>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                  <Image className="w-16 h-16 text-slate-400" />
                </div>
              )}

              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  property.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {property.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="mb-2 text-xl font-bold text-slate-800 line-clamp-2">
                {property.title}
              </h3>

              <div className="flex items-center mb-2 text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.city?.name || 'No city'}</span>
              </div>

              <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                {property.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold text-slate-800">
                    {property.price_per_night}
                  </span>
                  <span className="ml-1 text-gray-500">/night</span>
                </div>

                <div className="text-sm text-gray-500">
                  {getAmenityCount(property.amenities)} amenities
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => handleEditClick(property)}
                  className="inline-flex items-center justify-center flex-1 px-3 py-2 font-medium transition-colors rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  <Pencil className="w-4 h-4 mr-2" /> Edit
                </button>
                <button
                  onClick={() => handleAvailabilityClick(property)}
                  className="inline-flex items-center justify-center flex-1 px-3 py-2 font-medium text-green-700 transition-colors bg-green-100 rounded-lg hover:bg-green-200"
                >
                  <Clock className="w-4 h-4 mr-2" /> Availability
                </button>
                <button
                  onClick={() => setDeleteId(property.id)}
                  className="inline-flex items-center justify-center px-3 py-2 font-medium text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {properties.data.length === 0 && (
          <div className="py-12 text-center col-span-full">
            <div className="p-12 border shadow-lg bg-white/80 backdrop-blur-sm border-slate-200/50 rounded-2xl">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No properties yet</h3>
              <p className="mb-6 text-gray-600">Get started by adding your first property listing.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-6 py-3 font-semibold text-white transition-all transform rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" /> Add Your First Property
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreatePropertyModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        cities={cities}
      />

      <EditPropertyModal
        show={showEditModal}
        onClose={handleEditClose}
        cities={cities}
        property={editProperty}
      />

      <AvailabilityModal
        show={showAvailabilityModal}
        onClose={handleAvailabilityClose}
        property={availabilityProperty}
      />

      <DeletePropertyModal
        show={!!deleteId}
        onClose={() => setDeleteId(null)}
        propertyId={deleteId}
      />
    </div>
  );
}

Index.layout = (page) => <AppLayout children={page} />;
