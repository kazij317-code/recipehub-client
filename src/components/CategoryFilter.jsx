"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";

const CategoryFilter = ({ availableCategories }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeCategoriesStr = searchParams.get("categories") || "";
  const activeCategories = activeCategoriesStr ? activeCategoriesStr.split(",") : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (category) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("categories");
    } else {
      params.set("categories", category);
    }
    params.set("page", "1");
    router.push(`/browse-recipes?${params.toString()}`);
    setIsOpen(false);
  };

  const buttonLabel = activeCategories.length > 0
    ? activeCategories[0]
    : "All Categories";

  return (
    <div className="relative inline-block text-left w-full sm:w-72" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition duration-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800 cursor-pointer"
        >
          <span className="truncate">{buttonLabel}</span>
          <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 w-full origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-950 animate-in fade-in duration-200">
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {/* All Categories Option */}
            <button
              onClick={() => {
                handleSelect("All");
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition dark:text-slate-300 dark:hover:bg-zinc-900/50 cursor-pointer"
            >
              <span>All Categories</span>
              {activeCategories.length === 0 && <Check className="h-4 w-4 text-cyan-500" />}
            </button>

            {/* Available Categories Options */}
            {availableCategories.map((category) => {
              const isSelected = activeCategories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => {
                    handleSelect(category);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition dark:text-slate-300 dark:hover:bg-zinc-900/50 cursor-pointer"
                >
                  <span>{category}</span>
                  {isSelected && <Check className="h-4 w-4 text-cyan-500" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
