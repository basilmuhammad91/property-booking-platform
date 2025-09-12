import React from "react";
import { usePage, Link } from "@inertiajs/react";
import PropertyCard from "@/Components/PropertyCard";
import Pagination from "@/Components/Pagination";
import AppLayout from "@/Layouts/AppLayout";

export default function Index() {
  const { properties, filters } = usePage().props;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl -z-10" />
          <div className="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 shadow-lg">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Available Properties
            </h1>
            <p className="text-slate-600 text-lg">
              Discover your perfect home from our curated collection
            </p>
          </div>
        </div>
      </div>

      {properties.data.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No properties found</h3>
          <p className="text-slate-500">Try adjusting your search criteria or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.data.map((property) => (
            <Link href={route("properties.show", property.id)} key={property.id}>
              <PropertyCard property={property} />
            </Link>
          ))}
        </div>
      )}

      {properties.meta && properties.meta.last_page > 1 && (
        <div className="mt-16">
          <Pagination meta={properties.meta} />
        </div>
      )}
    </div>
  );
}

Index.layout = (page) => <AppLayout children={page} />;
