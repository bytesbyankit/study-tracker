"use client";

import React from "react";
import { Sparkles, Flame, Star, BookOpen } from "lucide-react";

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
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    );
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-3.5 py-2.5 sm:px-6 flex items-center justify-between gap-2">
        {/* Logo & App Name */}
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-200">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-1 truncate">
              Meri Padhai
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 inline" />
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">{today}</p>
          </div>
        </div>

        {/* Badges & Role Switcher */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          {/* Streak Badge */}
          <div
            className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-xs ${
              streak > 0
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-slate-100 text-slate-500"
            }`}
            title="Daily Study Streak"
          >
            <Flame className={`w-3.5 h-3.5 ${streak > 0 ? "text-orange-500 fill-orange-500 animate-pulse" : "text-slate-400"}`} />
            <span className="font-bold">{streak}</span>
            <span className="hidden sm:inline font-normal">{streak === 1 ? "Day" : "Days"}</span>
          </div>

          {/* Stars Badge */}
          <div
            className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200 shadow-xs"
            title="Stars Earned"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span className="font-bold">{totalStars}</span>
            <span className="hidden sm:inline font-normal">★</span>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center bg-purple-50 p-0.5 sm:p-1 rounded-xl border border-purple-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => setRole("bhanji")}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg min-h-[36px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                role === "bhanji"
                  ? "bg-white text-purple-700 font-bold shadow-xs"
                  : "text-slate-600 hover:text-purple-600"
              }`}
            >
              <span>👧</span>
              <span className="text-[11px] sm:text-xs">Bhanji</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("mama")}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg min-h-[36px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                role === "mama"
                  ? "bg-indigo-600 text-white font-bold shadow-xs"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              <span>👨‍🏫</span>
              <span className="text-[11px] sm:text-xs">Mama</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
