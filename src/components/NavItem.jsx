"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Plus,
  BookOpen,
  Heart,
  ShoppingBag,
  User,
  LogOut,
  Users,
  ClipboardList,
  ShieldAlert,
  CreditCard,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const DashboardNavItems = ({ navItems, user }) => {
  const pathname = usePathname();
  const router = useRouter();

  const getIcon = (label) => {
    switch (label) {
      case "Overview":
        return <LayoutDashboard size={20} />;
      case "Add Recipe":
        return <Plus size={20} />;
      case "My Recipes":
        return <BookOpen size={20} />;
      case "Favorites":
        return <Heart size={20} />;
      case "Purchased":
        return <ShoppingBag size={20} />;
      case "Profile":
        return <User size={20} />;
      case "Manage Users":
        return <Users size={20} />;
      case "Manage Recipes":
        return <ClipboardList size={20} />;
      case "Reports":
        return <ShieldAlert size={20} />;
      case "Transactions":
        return <CreditCard size={20} />;
      default:
        return <LayoutDashboard size={20} />;
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("logout successfully");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Navigation Links */}
      <nav className="flex flex-col gap-1">
        {navItems?.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + "/");

          return (
            <Link
              key={item.id}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/10 to-purple-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border-l-4 border-cyan-500 pl-3"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
              }`}
            >
              <span className="shrink-0">{getIcon(item.label)}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 w-full px-4 py-3 mt-2 rounded-lg font-medium text-rose-600 transition-all duration-200 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
      >
        <LogOut size={20} />
        <span>Sign Out</span>
      </button>
    </div>
  );
};

export default DashboardNavItems;
