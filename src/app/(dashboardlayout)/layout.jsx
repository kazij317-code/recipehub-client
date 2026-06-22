import React from "react";
import Navbar from "@/components/Navbar";
import NextThemeProvider from "@/providers/NextThemeProvider";
import { Toaster } from "react-hot-toast";
import DashboardSidebar from "@/components/DashboardSidebar";

const Layout = ({ children }) => {
  return (
    <>
      <NextThemeProvider>
        <Navbar />
        <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-zinc-950">
          <div className="mx-auto grid grid-cols-12 gap-0 max-w-7xl">
            <div className="col-span-3">
              <DashboardSidebar />
            </div>
            <div className="col-span-9 border-l border-slate-200 dark:border-zinc-800">
              <main className="bg-white dark:bg-zinc-900 min-h-[calc(100vh-80px)]">
                {children}
                <Toaster />
              </main>
            </div>
          </div>
        </div>
      </NextThemeProvider>
    </>
  );
};

export default Layout;
