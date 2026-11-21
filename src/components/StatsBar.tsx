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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
      {/* Today's Study Time */}
      <div className="bg-white/90 border border-purple-100 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Aaj Ki Padhai</span>
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 text-xl font-bold text-slate-800">
          {formatTime(stats.todayMinutes)}
        </div>
        <p className="text-[11px] text-purple-600 font-medium mt-0.5">
          {stats.todayMinutes > 0 ? "Shabash! Badhiya chal raha hai 🌟" : "Abhi start karna hai!"}
        </p>
      </div>

      {/* Pending Doubts */}
      <div className={`border rounded-2xl p-4 shadow-sm hover:shadow transition-shadow ${
        stats.pendingDoubts > 0
          ? "bg-rose-50/70 border-rose-200"
          : "bg-white/90 border-slate-100"
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Sawaal / Doubts</span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            stats.pendingDoubts > 0
              ? "bg-rose-100 text-rose-600"
              : "bg-slate-100 text-slate-500"
          }`}>
            <HelpCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 text-xl font-bold text-slate-800">
          {stats.pendingDoubts} <span className="text-xs font-normal text-slate-500">Poochhne hain</span>
        </div>
        <p className={`text-[11px] font-medium mt-0.5 ${stats.pendingDoubts > 0 ? "text-rose-600" : "text-emerald-600"}`}>
          {stats.pendingDoubts > 0 ? "Mama se clear karwana hai!" : "Saare doubts clear hain 🎉"}
        </p>
      </div>

      {/* Upcoming Targets */}
      <div className="bg-white/90 border border-blue-100 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Agle Targets</span>
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 text-xl font-bold text-slate-800">
          {stats.upcomingPlans} <span className="text-xs font-normal text-slate-500">Planned</span>
        </div>
        <p className="text-[11px] text-blue-600 font-medium mt-0.5">
          {stats.upcomingPlans > 0 ? "Focus bana kar rakhna hai 💪" : "Naye topics plan karein!"}
        </p>
      </div>

      {/* Doubts Solved */}
      <div className="bg-white/90 border border-emerald-100 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Doubts Solved</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 text-xl font-bold text-slate-800">
          {stats.solvedDoubts} <span className="text-xs font-normal text-slate-500">Cleared</span>
        </div>
        <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
          Concepts super clear! 🚀
        </p>
      </div>
    </div>
  );
}

