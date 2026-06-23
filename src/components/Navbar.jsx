"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import ThemeToggle from "./ThemeToggle";
import { useSession } from "@/lib/auth-client";
import DropdownButton from "./DropdownButton";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const { data } = useSession();
  const user = data?.user;

  const getLinkClass = (path) => {
    const isActive =
      pathname === path || (path !== "/" && pathname.startsWith(path));

    return `transition duration-300 ${
      isActive
        ? "bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent font-bold"
        : "text-gray-700 dark:text-gray-200 hover:text-cyan-500"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-200/10 backdrop-blur-md bg-linear-to-r from-white via-sky-50 to-white dark:from-[#0b1120] dark:via-[#111827] dark:to-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white shadow-md">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 18h12M12 2a5 5 0 0 0-5 5v3h10V7a5 5 0 0 0-5-5zM4 10a2 2 0 0 0-2 2v2c0 2.2 1.8 4 4 4h12c2.2 0 4-1.8 4-4v-2a2 2 0 0 0-2-2z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
              RecipeHub
            </h1>
          </Link>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium">
            <Link href="/" className={getLinkClass("/")}>
              Home
            </Link>

            <Link
              href="/browse-recipes"
              className={getLinkClass("/browse-recipes")}
            >
              Browse Recipes
            </Link>

            {user && (
              <Link
                href={user.role === "admin" ? "/dashboard/admin" : "/dashboard"}
                className={getLinkClass(user.role === "admin" ? "/dashboard/admin" : "/dashboard")}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* desktop actions */}
          <div className="hidden md:block">
            <div className="flex items-center gap-4">
              <ThemeToggle />

              {user ? (
                <DropdownButton user={user} />
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-gray-700 dark:text-gray-200 hover:text-cyan-500"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-cyan-500/20 font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-700 dark:text-white"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* mobile nav */}
        {open && (
          <div className="md:hidden pb-5 pt-2">
            <nav className="flex flex-col gap-4 font-medium">
              <Link
                href="/"
                className={getLinkClass("/")}
                onClick={() => setOpen(false)}
              >
                Home
              </Link>

              <Link
                href="/browse-recipes"
                className={getLinkClass("/browse-recipes")}
                onClick={() => setOpen(false)}
              >
                Browse Recipes
              </Link>

              {user && (
                <Link
                  href={user.role === "admin" ? "/dashboard/admin" : "/dashboard"}
                  className={getLinkClass(user.role === "admin" ? "/dashboard/admin" : "/dashboard")}
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
              )}

              <div>
                <ThemeToggle />
              </div>

              {user ? (
                <DropdownButton user={user} />
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    className={`${getLinkClass("/login")} px-4 py-2`}
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg w-fit transition-all duration-300 shadow-md hover:shadow-cyan-500/20"
                    onClick={() => setOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
