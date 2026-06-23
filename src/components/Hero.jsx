"use client";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const router = useRouter();
  return (
    <section
      className="min-h-screen flex items-center px-6 transition-colors duration-300 bg-gradient-to-r from-white via-sky-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-black"
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-10">
        {/* LEFT SIDE */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400 mb-6 border border-purple-100 dark:border-purple-900/50">
            ✨ Discover & Share the Joy of Cooking
          </div>

          <h1
            className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white"
          >
            Discover & Share{" "}
            <span className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Delicious Recipes
            </span>{" "}
          </h1>
          <p
            className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl"
          >
            Explore thousands of delicious recipes from food lovers around the
            world. Share your own recipes, discover new flavors, and save your
            favorite dishes in one place.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <button
              onClick={() => router.push("/browse-recipes")}
              className="group flex items-center gap-2 px-8 py-3.5 rounded-full text-lg font-semibold shadow-lg shadow-purple-500/25 dark:shadow-purple-500/10 transition-all duration-300 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white hover:scale-[1.02] cursor-pointer"
            >
              Explore Recipes
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="mt-10 flex gap-8 border-t border-slate-100 dark:border-zinc-800/80 pt-8 justify-center md:justify-start">
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">10K+</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Recipes Available</p>
            </div>
            <div className="w-[1px] bg-slate-200 dark:bg-zinc-800/80"></div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">5K+</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Expert Chefs</p>
            </div>
            <div className="w-[1px] bg-slate-200 dark:bg-zinc-800/80"></div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">4.9 ★</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Average Rating</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="relative max-w-full">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&auto=format&fit=crop&q=80"
              alt="Recipe Hero"
              className="w-full h-[450px] object-cover rounded-[32px] shadow-2xl transition duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
