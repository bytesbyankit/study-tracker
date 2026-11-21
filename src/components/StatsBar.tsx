"use client";

import React from "react";
import { Clock, HelpCircle, CheckCircle2, Target } from "lucide-react";
import { StatsData } from "@/lib/types";

interface StatsBarProps {
  stats: StatsData;
}

export default function StatsBar({ stats }: StatsBarProps) {
  const formatTime = (minutes: number) => {
    if (minutes === 0) return "0 min";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
    if (hrs > 0) return `${hrs} hr${hrs > 1 ? "s" : ""}`;
    return `${mins} min`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 my-3 sm:my-4">
      {/* Today's Study Time */}
      <div className="bg-white/95 border border-purple-100/90 rounded-2xl p-3 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Aaj Ki Padhai</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="mt-1 sm:mt-2 text-lg sm:text-xl font-bold text-slate-800">
          {formatTime(stats.todayMinutes)}
        </div>
        <p className="text-[10px] sm:text-[11px] text-purple-600 font-medium mt-0.5 truncate">
          {stats.todayMinutes > 0 ? "Shabash! 🌟" : "Abhi start karo!"}
        </p>
      </div>

      {/* Pending Doubts */}
      <div
        className={`border rounded-2xl p-3 sm:p-4 shadow-xs ${
          stats.pendingDoubts > 0
            ? "bg-rose-50/80 border-rose-200"
            : "bg-white/95 border-slate-100"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Sawaal / Doubts</span>
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${
              stats.pendingDoubts > 0
                ? "bg-rose-100 text-rose-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="mt-1 sm:mt-2 text-lg sm:text-xl font-bold text-slate-800">
          {stats.pendingDoubts} <span className="text-[10px] sm:text-xs font-normal text-slate-500">Baaki</span>
        </div>
        <p
          className={`text-[10px] sm:text-[11px] font-medium mt-0.5 truncate ${
            stats.pendingDoubts > 0 ? "text-rose-600" : "text-emerald-600"
          }`}
        >
          {stats.pendingDoubts > 0 ? "Mama se poochho!" : "Saare clear! 🎉"}
        </p>
      </div>

      {/* Upcoming Targets */}
      <div className="bg-white/95 border border-blue-100/90 rounded-2xl p-3 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Agle Targets</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="mt-1 sm:mt-2 text-lg sm:text-xl font-bold text-slate-800">
          {stats.upcomingPlans} <span className="text-[10px] sm:text-xs font-normal text-slate-500">Goals</span>
        </div>
        <p className="text-[10px] sm:text-[11px] text-blue-600 font-medium mt-0.5 truncate">
          {stats.upcomingPlans > 0 ? "Focus banao 💪" : "Naye plan karo!"}
        </p>
      </div>

      {/* Doubts Solved */}
      <div className="bg-white/95 border border-emerald-100/90 rounded-2xl p-3 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Doubts Solved</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="mt-1 sm:mt-2 text-lg sm:text-xl font-bold text-slate-800">
          {stats.solvedDoubts} <span className="text-[10px] sm:text-xs font-normal text-slate-500">Clear</span>
        </div>
        <p className="text-[10px] sm:text-[11px] text-emerald-600 font-medium mt-0.5 truncate">
          Concepts super clear! 🚀
        </p>
      </div>
    </div>
  );
}
