import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NextThemeProvider from "@/providers/NextThemeProvider";
import React from "react";
import { Toaster } from "react-hot-toast";

const layout = ({ children }) => {
  return (
    <div>
      <NextThemeProvider>
        <Navbar />
        <main className="min-h-[calc(100vh-200px)]">
          {children}
          <Toaster />
        </main>
        <Footer />
      </NextThemeProvider>
    </div>
  );
};

export default layout;
