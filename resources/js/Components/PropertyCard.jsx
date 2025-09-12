import React from "react";
import { Link } from "@inertiajs/react";

export default function PropertyCard({ property }) {
  return (
    <div className="group relative bg-card-background rounded-xl shadow hover:shadow-lg border border-color-border transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={property.images?.[0] ?? "https://via.placeholder.com/400x250"}
          alt={property.title}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Price badge */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-card-background px-3 py-1.5 rounded-md shadow text-color-text">
            <span className="text-sm font-semibold">
              ${property.price_per_night}
            </span>
            <span className="text-xs text-slate-500 ml-1">/night</span>
          </div>
        </div>
      </div>

      {/* Card content */}
      <div className="p-5 space-y-3">
        {/* Title + Description */}
        <div>
          <h2 className="text-lg font-semibold text-color-text line-clamp-1 group-hover:text-color-text-secondary">
            {property.title}
          </h2>
          <p className="text-sm text-slate-500 line-clamp-2 mt-1">
            {property.description}
          </p>
        </div>

        {/* Location + Rating */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <svg
              className="w-4 h-4 text-color-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{property.city?.name}</span>
          </div>

          <div className="flex items-center space-x-1">
            <svg
              className="w-4 h-4 text-yellow-400 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-slate-600">4.8</span>
          </div>
        </div>

        {/* CTA button */}
        <div className="pt-3">
          <Link
            href={`/properties/${property.id}`}
            className="flex items-center justify-center py-2 px-4 w-full bg-color-primary text-color-background-alt rounded-md font-medium text-sm hover:bg-color-primary-dark transition-colors"
          >
            <span>View Details</span>
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
