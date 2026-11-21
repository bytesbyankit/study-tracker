"use client";

import React from "react";
import { Sparkles, Flame, Star, User, BookOpen } from "lucide-react";

interface HeaderProps {
  role: "bhanji" | "mama";
  setRole: (r: "bhanji" | "mama") => void;
  streak: number;
  totalStars: number;
}

export default function Header({ role, setRole, streak, totalStars }: HeaderProps) {
  const [today, setToday] = React.useState<string>("");

  React.useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    );
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        {/* App Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-1.5">
              Meri Padhai Tracker
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 inline" />
            </h1>
            <p className="text-xs text-slate-500 font-medium">{today}</p>
          </div>
        </div>

        {/* Badges & Role Switcher */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Streak Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-transform hover:scale-105 ${
              streak > 0
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-slate-100 text-slate-500"
            }`}
            title="Daily Study Streak"
          >
            <Flame className={`w-4 h-4 ${streak > 0 ? "text-orange-500 fill-orange-500 animate-pulse" : "text-slate-400"}`} />
            <span>{streak} {streak === 1 ? "Day" : "Days"} Streak</span>
          </div>

          {/* Stars Badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200 shadow-sm transition-transform hover:scale-105"
            title="Stars Earned from Mama/Mentor"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{totalStars} Stars</span>
          </div>

          {/* Role Mode Switcher */}
          <div className="flex items-center bg-purple-50 p-1 rounded-xl border border-purple-200 text-xs font-medium">
            <button
              onClick={() => setRole("bhanji")}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                role === "bhanji"
                  ? "bg-white text-purple-700 font-semibold shadow-sm"
                  : "text-slate-600 hover:text-purple-600"
              }`}
            >
              <span>👧</span>
              <span className="hidden sm:inline">Bhanji</span>
            </button>
            <button
              onClick={() => setRole("mama")}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                role === "mama"
                  ? "bg-indigo-600 text-white font-semibold shadow-sm"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              <span>👨‍🏫</span>
              <span className="hidden sm:inline">Mama / Mentor</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
