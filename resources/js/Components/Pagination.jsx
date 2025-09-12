import React from "react";
import { Link } from "@inertiajs/react";

export default function Pagination({ meta }) {
  if (!meta || meta.last_page <= 1) return null;

  const getVisiblePages = () => {
    const current = meta.current_page;
    const total = meta.last_page;
    const delta = 2;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < total - 1) {
      rangeWithDots.push('...', total);
    } else {
      rangeWithDots.push(total);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-center space-x-1 py-8">
      <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-slate-200/50">

        {meta.current_page > 1 && (
          <Link
            href={`?page=${meta.current_page - 1}`}
            className="group flex items-center justify-center w-11 h-11 rounded-xl bg-white shadow-md hover:shadow-lg border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        )}

        {getVisiblePages().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`dots-${index}`} className="flex items-center justify-center w-11 h-11 text-slate-400 font-medium">
                ⋯
              </span>
            );
          }

          const isActive = meta.current_page === page;

          return (
            <Link
              key={page}
              href={`?page=${page}`}
              className={`relative flex items-center justify-center w-11 h-11 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-500/20"
                  : "bg-white text-slate-700 shadow-md hover:shadow-lg border border-slate-200 hover:border-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600"
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur-sm opacity-30 animate-pulse" />
              )}
              <span className="relative z-10">{page}</span>
            </Link>
          );
        })}

        {meta.current_page < meta.last_page && (
          <Link
            href={`?page=${meta.current_page + 1}`}
            className="group flex items-center justify-center w-11 h-11 rounded-xl bg-white shadow-md hover:shadow-lg border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
