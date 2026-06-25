"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white pt-16 pb-8 dark:border-zinc-800 dark:bg-zinc-950 transition duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-10 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {/* Logo & About */}
        <div className="space-y-4">
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
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A premium community for culinary enthusiasts. Share your favorite recipes, explore new cuisines, and connect with food lovers worldwide.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-sm font-medium text-slate-600 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-cyan-500 transition duration-200">Home</Link>
            </li>
            <li>
              <Link href="/browse-recipes" className="hover:text-cyan-500 transition duration-200">Browse Recipes</Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-cyan-500 transition duration-200">Login</Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-cyan-500 transition duration-200">Register</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Contact Us
          </h3>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-cyan-500 shrink-0" />
              <span className="truncate">mithu00781@gmail.com</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-cyan-500 shrink-0" />
              <span>+8801712736526</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-cyan-500 shrink-0" />
              <span>Rayerbag, Dhaka</span>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Follow Us
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Join our visual food feeds and social discussions!
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:text-cyan-500 hover:bg-cyan-50 hover:border-cyan-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-400 dark:hover:text-cyan-400 dark:hover:bg-cyan-950/20 dark:hover:border-cyan-950 transition duration-300">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="#" className="p-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:text-cyan-500 hover:bg-cyan-50 hover:border-cyan-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-400 dark:hover:text-cyan-400 dark:hover:bg-cyan-950/20 dark:hover:border-cyan-950 transition duration-300">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" className="p-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:text-cyan-500 hover:bg-cyan-50 hover:border-cyan-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-400 dark:hover:text-cyan-400 dark:hover:bg-cyan-950/20 dark:hover:border-cyan-950 transition duration-300">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a href="#" className="p-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:text-cyan-500 hover:bg-cyan-50 hover:border-cyan-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-400 dark:hover:text-cyan-400 dark:hover:bg-cyan-950/20 dark:hover:border-cyan-950 transition duration-300">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-12 pt-6 border-t border-slate-100 dark:border-zinc-800/80 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>&copy; {new Date().getFullYear()} RecipeHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
