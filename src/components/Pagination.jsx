"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ totalPages, currentPage }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/browse-recipes?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800 cursor-pointer"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {Array.from({ length: totalPages }, (_, idx) => {
        const pageNum = idx + 1;
        const isCurrent = pageNum === currentPage;
        return (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition duration-300 cursor-pointer ${
              isCurrent
                ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800"
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800 cursor-pointer"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination;
