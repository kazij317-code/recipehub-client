"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  BookOpen,
  Heart,
  ShoppingBag,
  User,
  Users,
  ClipboardList,
  ShieldAlert,
  CreditCard,
} from "lucide-react";

const MobileDashboardNav = ({ user }) => {
  const pathname = usePathname();

  const getIcon = (label) => {
    switch (label) {
      case "Overview":
        return <LayoutDashboard size={16} />;
      case "Add Recipe":
        return <Plus size={16} />;
      case "My Recipes":
        return <BookOpen size={16} />;
      case "Favorites":
        return <Heart size={16} />;
      case "Purchased":
        return <ShoppingBag size={16} />;
      case "Profile":
        return <User size={16} />;
      case "Manage Users":
        return <Users size={16} />;
      case "Manage Recipes":
        return <ClipboardList size={16} />;
      case "Reports":
        return <ShieldAlert size={16} />;
      case "Transactions":
        return <CreditCard size={16} />;
      default:
        return <LayoutDashboard size={16} />;
    }
  };

  const dashboardItems = {
    user: [
      { id: "overview", label: "Overview", path: "/dashboard" },
      { id: "add-recipe", label: "Add Recipe", path: "/dashboard/user/add-recipe" },
      { id: "my-recipes", label: "My Recipes", path: "/dashboard/my-recipes" },
      { id: "favorites", label: "Favorites", path: "/dashboard/favorites" },
      { id: "purchased", label: "Purchased", path: "/dashboard/purchased" },
      { id: "profile", label: "Profile", path: "/dashboard/profile" },
    ],
    admin: [
      { id: "overview", label: "Overview", path: "/dashboard/admin" },
      { id: "manage-users", label: "Manage Users", path: "/dashboard/admin/users" },
      { id: "manage-recipes", label: "Manage Recipes", path: "/dashboard/admin/recipes" },
      { id: "reports", label: "Reports", path: "/dashboard/admin/reports" },
      { id: "transactions", label: "Transactions", path: "/dashboard/admin/transactions" },
    ],
  };

  const navItems = dashboardItems[user?.role || "user"] || [];

  return (
    <div className="lg:hidden w-full border-b border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 sticky top-[64px] z-40">
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== "/dashboard" && item.path !== "/dashboard/admin" && pathname.startsWith(item.path + "/"));

          return (
            <Link
              key={item.id}
              href={item.path}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-400"
                  : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
              }`}
            >
              <span className="shrink-0">{getIcon(item.label)}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileDashboardNav;
