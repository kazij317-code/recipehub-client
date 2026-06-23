"use client";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();
  return (
    <section
      className="min-h-screen flex items-center px-6 transition-colors duration-300 bg-gradient-to-r from-white via-sky-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-black"
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-10">
        {/* LEFT SIDE */}
        <div className="flex-1 text-center md:text-left">
          <h1
            className="text-4xl md:text-6xl font-bold leading-tight text-gray-800 dark:text-white"
          >
            Discover & Share{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
              Delicious Recipes
            </span>{" "}
          </h1>
          <p
            className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300"
          >
            Explore thousands of delicious recipes from food lovers around the
            world. Share your own recipes, discover new flavors, and save your
            favorite dishes in one place.
          </p>

          <button
            onClick={() => router.push("/browse-recipes")}
            className="mt-8 px-8 py-3 rounded-lg text-lg font-semibold shadow-md transition-all duration-300 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white hover:shadow-cyan-500/30"
          >
            Explore Recipes
          </button>
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
