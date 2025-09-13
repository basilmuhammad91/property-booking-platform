import React, { useState } from "react";
import { usePage, router, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import CreatePropertyModal from "@/Components/Modals/CreatePropertyModal";
import DeletePropertyModal from "@/Components/Modals/DeletePropertyModal";
import { Plus, Pencil, Trash2 } from "lucide-react"; // ✅ Lucide imports

export default function Index() {
  const { properties, cities } = usePage().props;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
          Manage Properties
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-5 py-2 font-semibold text-white shadow bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Property
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden border shadow-lg bg-white/80 backdrop-blur-sm border-slate-200/50 rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            {/* Add your thead here */}
          </thead>
          <tbody>
            {properties.data.map((property) => (
              <tr
                key={property.id}
                className="border-t border-slate-100 hover:bg-slate-50/50"
              >
                <td className="px-6 py-4">{property.title}</td>
                <td className="px-6 py-4">{property.city?.name}</td>
                <td className="px-6 py-4">${property.price_per_night}</td>
                <td className="px-6 py-4 space-x-2 text-right">
                  <Link
                    href={route("admin.properties.edit", property.id)}
                    className="inline-flex items-center px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700"
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Link>
                  <button
                    onClick={() => setDeleteId(property.id)}
                    className="inline-flex items-center px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <CreatePropertyModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        cities={cities}
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
