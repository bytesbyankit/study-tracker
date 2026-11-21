"use client";

import React from "react";
import { BookOpen, Calendar, HelpCircle, Award } from "lucide-react";

interface MobileBottomNavProps {
  activeTab: "daily" | "planner" | "doubts" | "trophies";
  setActiveTab: (tab: "daily" | "planner" | "doubts" | "trophies") => void;
  pendingDoubts: number;
  upcomingPlans: number;
  totalStars: number;
}

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  pendingDoubts,
  upcomingPlans,
  totalStars,
}: MobileBottomNavProps) {
  const tabs = [
    {
      id: "daily" as const,
      label: "Aaj Padhai",
      icon: BookOpen,
      badge: null,
      activeColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "planner" as const,
      label: "Targets",
      icon: Calendar,
      badge: upcomingPlans > 0 ? upcomingPlans : null,
      badgeColor: "bg-blue-500",
      activeColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "doubts" as const,
      label: "Doubts",
      icon: HelpCircle,
      badge: pendingDoubts > 0 ? pendingDoubts : null,
      badgeColor: "bg-rose-500 animate-pulse",
      activeColor: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      id: "trophies" as const,
      label: "Trophies",
      icon: Award,
      badge: totalStars > 0 ? `★${totalStars}` : null,
      badgeColor: "bg-amber-500",
      activeColor: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-purple-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="grid grid-cols-4 px-2 pt-1.5" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 min-h-[48px] rounded-2xl transition-all relative ${
                isActive ? `${tab.activeColor} ${tab.bgColor} font-bold` : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
                {tab.badge !== null && (
                  <span
                    className={`absolute -top-1.5 -right-3 text-[10px] font-bold text-white px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-xs ${
                      tab.badgeColor || "bg-purple-600"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

