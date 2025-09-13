import React, { useState } from "react";
import { usePage, router, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import Pagination from "@/Components/Pagination";
import { Plus, Trash2, Edit } from "lucide-react";

export default function Index() {
  const { properties } = usePage().props;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = (id) => {
    router.delete(route("admin.properties.destroy", id), {
      onSuccess: () => setDeleteId(null),
    });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    router.post(route("admin.properties.store"), formData, {
      onSuccess: () => setShowCreateModal(false),
    });
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
            Manage Properties
          </h1>
          <p className="mt-1 text-slate-600">
            Create, update and manage all listed properties
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2 font-semibold text-white shadow bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="inline w-5 h-5 mr-2" /> Add Property
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden border shadow-lg bg-white/80 backdrop-blur-sm border-slate-200/50 rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                Title
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                City
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                Price/Night
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                Status
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-right text-slate-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {properties.data.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No properties found.
                </td>
              </tr>
            ) : (
              properties.data.map((property) => (
                <tr
                  key={property.id}
                  className="border-t border-slate-100 hover:bg-slate-50/50"
                >
                  <td className="px-6 py-4">{property.title}</td>
                  <td className="px-6 py-4">{property.city?.name}</td>
                  <td className="px-6 py-4">${property.price_per_night}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        property.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {property.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2 text-right">
                    <Link
                      href={route("admin.properties.edit", property.id)}
                      className="inline-flex items-center px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700"
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Link>
                    <button
                      onClick={() => setDeleteId(property.id)}
                      className="inline-flex items-center px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {properties.meta && properties.meta.last_page > 1 && (
        <div className="mt-8">
          <Pagination meta={properties.meta} />
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-2xl">
            <h2 className="mb-4 text-xl font-bold">Add New Property</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                className="w-full px-3 py-2 border rounded-lg border-slate-300"
                required
              />
              <input
                type="text"
                name="city_id"
                placeholder="City ID"
                className="w-full px-3 py-2 border rounded-lg border-slate-300"
                required
              />
              <input
                type="number"
                name="price_per_night"
                placeholder="Price per night"
                className="w-full px-3 py-2 border rounded-lg border-slate-300"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-2xl">
            <h2 className="mb-4 text-lg font-semibold">
              Are you sure you want to delete this property?
            </h2>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Index.layout = (page) => <AppLayout children={page} />;
