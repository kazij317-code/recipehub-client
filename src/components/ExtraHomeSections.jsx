"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Flame, Sparkles, Compass, ArrowRight } from "lucide-react";

const ExtraHomeSections = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  const culinaryTips = [
    {
      icon: <Flame className="h-6 w-6 text-orange-500" />,
      title: "Perfect Searing",
      description: "Learn the secrets of heat control and pan temperature to get that golden-brown caramelized crust every single time.",
      bg: "from-orange-500/10 to-amber-500/10",
      border: "hover:border-orange-500/30",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-cyan-500" />,
      title: "Knife Skills 101",
      description: "Master the rock chop, slice, and julienne cuts. Keep your fingers safe while chopping with the professional claw grip.",
      bg: "from-cyan-500/10 to-blue-500/10",
      border: "hover:border-cyan-500/30",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-purple-500" />,
      title: "The Art of Seasoning",
      description: "Understand the balance of salt, acid, fat, and heat. Elevate simple ingredients into premium culinary masterpieces.",
      bg: "from-purple-500/10 to-pink-500/10",
      border: "hover:border-purple-500/30",
    },
  ];

  const showcaseCuisines = [
    {
      title: "Mediterranean Bliss",
      count: "120+ Recipes",
      image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80",
    },
    {
      title: "Asian Fusion",
      count: "85+ Recipes",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80",
    },
    {
      title: "Spicy Latin America",
      count: "94+ Recipes",
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",
    },
  ];

  return (
    <div className="space-y-24 py-16 max-w-7xl mx-auto px-4 md:px-10 overflow-hidden">
      
      {/* SECTION 1: Culinary Tips & Masterclass Cards */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-12"
      >
        <motion.div 
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6 dark:border-zinc-800"
        >
          <div className="space-y-2">
            <span className="text-sm font-bold uppercase tracking-widest text-cyan-500">Culinary Wisdom</span>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">
              <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                Kitchen Masterclass
              </span>
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">
            Boost your cooking confidence with quick, essential techniques compiled by our professional chef network.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {culinaryTips.map((tip, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.01 }}
              className={`group relative overflow-hidden rounded-[32px] border border-slate-200/60 bg-linear-to-br ${tip.bg} p-8 transition-shadow duration-300 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 ${tip.border}`}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md dark:bg-zinc-900">
                {tip.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-cyan-500 transition-colors">
                {tip.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {tip.description}
              </p>
              
              {/* Subtle accent corner glow */}
              <div className="absolute -right-10 -bottom-10 h-24 w-24 rounded-full bg-cyan-500/10 blur-xl group-hover:bg-cyan-500/20 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* SECTION 2: Global Culinary Showcase */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-12"
      >
        <motion.div 
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6 dark:border-zinc-800"
        >
          <div className="space-y-2">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-500">Global Flavors</span>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">
              <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                Explore Cuisines
              </span>
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">
            Embark on a culinary journey around the globe. Discover regional ingredients, spices, and methods.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {showcaseCuisines.map((cuisine, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="group relative h-80 overflow-hidden rounded-[32px] shadow-md border border-slate-200/50 dark:border-zinc-800"
            >
              {/* Background Image */}
              <img
                src={cuisine.image}
                alt={cuisine.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-750 group-hover:scale-105"
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white space-y-2">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    {cuisine.count}
                  </span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight">
                  {cuisine.title}
                </h3>
                <div className="pt-2 flex items-center gap-1 text-sm font-medium text-slate-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span>Explore Now</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

    </div>
  );
};

export default ExtraHomeSections;
