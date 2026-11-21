"use client";

import React from "react";
import { StudyLog, Doubt, PlanItem, SubjectItem, StatsData } from "@/lib/types";
import { Award, Star, Flame, CheckCircle, Clock, BookOpen } from "lucide-react";

interface TrophyTabProps {
  logs: StudyLog[];
  doubts: Doubt[];
  plans: PlanItem[];
  subjects: SubjectItem[];
  stats: StatsData;
}

export default function TrophyTab({
  logs,
  doubts,
  plans,
  subjects,
  stats,
}: TrophyTabProps) {
  // Compute subject breakdown
  const subjectTimeMap: Record<string, number> = {};
  logs.forEach((log) => {
    subjectTimeMap[log.subject] = (subjectTimeMap[log.subject] || 0) + log.timeSpentMinutes;
  });

  const totalMinutes = stats.totalMinutes || 1; // avoid / 0

  // Achievements
  const achievements = [
    {
      id: "first_log",
      title: "Pehla Kadam! 🌟",
      desc: "Apna pehla study topic log kiya",
      unlocked: logs.length >= 1,
      icon: "🌱",
    },
    {
      id: "streak_3",
      title: "Streak Champion 🔥",
      desc: "Lagaataar 3 din padhai ki",
      unlocked: stats.streak >= 3,
      icon: "🔥",
    },
    {
      id: "doubt_solver",
      title: "Curious Mind 🧠",
      desc: "Mama se sawaal poochha aur clear kiya",
      unlocked: stats.solvedDoubts >= 1,
      icon: "💡",
    },
    {
      id: "stars_10",
      title: "Super Star ⭐",
      desc: "Mama se 10+ stars earn kiye",
      unlocked: stats.totalStars >= 10,
      icon: "⭐",
    },
    {
      id: "target_5",
      title: "Goal Crusher 🎯",
      desc: "3 se zyada planned targets complete kiye",
      unlocked: plans.filter((p) => p.isCompleted).length >= 3,
      icon: "🎯",
    },
    {
      id: "study_master",
      title: "Padhai Superstar 👑",
      desc: "Total 5 ghante se zyada padhai ki",
      unlocked: stats.totalMinutes >= 300,
      icon: "👑",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-purple-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              Padhai Hall of Fame
            </span>
            <h2 className="text-2xl font-black mt-2">Shabash! Badhiya mehnat chal rahi hai 🎉</h2>
            <p className="text-xs sm:text-sm text-purple-100 mt-1">
              Har roz thoda thoda padhne se hi bade sapne poore hote hain!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
            <div className="text-center px-2">
              <div className="text-2xl font-black">{stats.totalStars}</div>
              <div className="text-[10px] text-amber-200 uppercase font-semibold">Total Stars</div>
            </div>
            <div className="w-[1px] h-8 bg-white/30" />
            <div className="text-center px-2">
              <div className="text-2xl font-black">{stats.streak}</div>
              <div className="text-[10px] text-orange-200 uppercase font-semibold">Days Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges & Achievements Grid */}
      <div>
        <h3 className="text-md font-bold text-slate-800 flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Bhanji Ke Badges & Trophies</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`rounded-2xl p-4 border transition-all ${
                ach.unlocked
                  ? "bg-white border-amber-200 shadow-sm hover:scale-[1.02]"
                  : "bg-slate-50/70 border-slate-200 opacity-60"
              }`}
            >
              <div className="text-3xl mb-2">{ach.unlocked ? ach.icon : "🔒"}</div>
              <h4 className="text-sm font-bold text-slate-800">{ach.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{ach.desc}</p>
              <div className="mt-2">
                {ach.unlocked ? (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Unlocked! 🎉
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    Abhi locked hai
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100/80 shadow-sm">
        <h3 className="text-md font-bold text-slate-800 flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <span>Subject Wise Padhai Time</span>
        </h3>

        {Object.keys(subjectTimeMap).length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            Padhai log karne par yahan subject wise chart dikhega!
          </p>
        ) : (
          <div className="space-y-3">
            {Object.entries(subjectTimeMap).map(([subj, minutes]) => {
              const matched = subjects.find((s) => s.name === subj);
              const percentage = Math.round((minutes / totalMinutes) * 100);

              return (
                <div key={subj} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span>{matched?.icon || "📚"}</span>
                      <span>{subj}</span>
                    </span>
                    <span className="text-slate-500">
                      {minutes} mins ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

