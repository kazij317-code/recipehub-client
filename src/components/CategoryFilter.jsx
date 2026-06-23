"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

const CategoryFilter = ({ availableCategories }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategoriesStr = searchParams.get("categories") || "";
  const activeCategories = activeCategoriesStr ? activeCategoriesStr.split(",") : [];

  const handleToggle = (category) => {
    let newCategories;
    if (activeCategories.includes(category)) {
      newCategories = activeCategories.filter((c) => c !== category);
    } else {
      newCategories = [...activeCategories, category];
    }

    const params = new URLSearchParams(searchParams.toString());
    if (newCategories.length > 0) {
      params.set("categories", newCategories.join(","));
    } else {
      params.delete("categories");
    }
    params.set("page", "1");
    router.push(`/browse-recipes?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2.5">
      {availableCategories.map((category) => {
        const isActive = activeCategories.includes(category);
        return (
          <button
            key={category}
            onClick={() => handleToggle(category)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 shadow-2xs cursor-pointer ${
              isActive
                ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
