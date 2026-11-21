"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import DailyLogTab from "@/components/DailyLogTab";
import PlannerTab from "@/components/PlannerTab";
import DoubtBoxTab from "@/components/DoubtBoxTab";
import TrophyTab from "@/components/TrophyTab";
import AddSubjectModal from "@/components/AddSubjectModal";
import { StudyLog, PlanItem, Doubt, SubjectItem, StatsData } from "@/lib/types";
import { BookOpen, Calendar, HelpCircle, Award, Loader2 } from "lucide-react";

export default function Home() {
  const [role, setRole] = useState<"bhanji" | "mama">("bhanji");
  const [activeTab, setActiveTab] = useState<"daily" | "planner" | "doubts" | "trophies">("daily");

  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [stats, setStats] = useState<StatsData>({
    todayMinutes: 0,
    totalMinutes: 0,
    streak: 0,
    pendingDoubts: 0,
    solvedDoubts: 0,
    upcomingPlans: 0,
    totalStars: 0,
    totalSessions: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [greeting, setGreeting] = useState("Namaste! 🌟");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning! ☀️");
    } else if (hour < 17) {
      setGreeting("Good Afternoon! 🌤️");
    } else {
      setGreeting("Good Evening! 🌙");
    }
  }, []);

  // Load all data
  const loadData = useCallback(async () => {
    try {
      const [logsRes, plansRes, doubtsRes, subjectsRes, statsRes] = await Promise.all([
        fetch("/api/study-logs"),
        fetch("/api/plans"),
        fetch("/api/doubts"),
        fetch("/api/subjects"),
        fetch("/api/stats"),
      ]);

      if (logsRes.ok) setLogs(await logsRes.json());
      if (plansRes.ok) setPlans(await plansRes.json());
      if (doubtsRes.ok) setDoubts(await doubtsRes.json());
      if (subjectsRes.ok) setSubjects(await subjectsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error("Error loading app data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Log handlers
  const handleAddLog = async (logData: {
    date: string;
    subject: string;
    topic: string;
    timeSpentMinutes: number;
    confidence: "GREAT" | "CONFUSED" | "HARD";
    notes?: string;
  }) => {
    const res = await fetch("/api/study-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });
    if (res.ok) await loadData();
  };

  const handleUpdateLog = async (id: string, updateData: Partial<StudyLog>) => {
    const res = await fetch("/api/study-logs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updateData }),
    });
    if (res.ok) await loadData();
  };

  const handleDeleteLog = async (id: string) => {
    const res = await fetch(`/api/study-logs?id=${id}`, { method: "DELETE" });
    if (res.ok) await loadData();
  };

  // Plan handlers
  const handleAddPlan = async (planData: {
    targetDate: string;
    subject: string;
    topic: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    notes?: string;
  }) => {
    const res = await fetch("/api/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(planData),
    });
    if (res.ok) await loadData();
  };

  const handleTogglePlan = async (id: string, isCompleted: boolean) => {
    const res = await fetch("/api/plans", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isCompleted }),
    });
    if (res.ok) await loadData();
  };

  const handleDeletePlan = async (id: string) => {
    const res = await fetch(`/api/plans?id=${id}`, { method: "DELETE" });
    if (res.ok) await loadData();
  };

  const handleQuickLogToDaily = (plan: PlanItem) => {
    setActiveTab("daily");
    handleAddLog({
      date: new Date().toISOString().split("T")[0],
      subject: plan.subject,
      topic: plan.topic,
      timeSpentMinutes: 30,
      confidence: "GREAT",
      notes: plan.notes || "Completed planned target!",
    });
  };

  // Doubt handlers
  const handleAddDoubt = async (doubtData: {
    subject: string;
    topic?: string;
    question: string;
    bookReference?: string;
  }) => {
    const res = await fetch("/api/doubts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doubtData),
    });
    if (res.ok) await loadData();
  };

  const handleResolveDoubt = async (id: string, resolutionNotes?: string) => {
    const res = await fetch("/api/doubts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status: "SOLVED",
        resolutionNotes,
      }),
    });
    if (res.ok) await loadData();
  };

  const handleDeleteDoubt = async (id: string) => {
    const res = await fetch(`/api/doubts?id=${id}`, { method: "DELETE" });
    if (res.ok) await loadData();
  };

  // Add subject handler
  const handleAddSubject = async (sub: { name: string; icon: string; color: string }) => {
    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });
    if (res.ok) await loadData();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Role switcher and Streaks */}
      <Header
        role={role}
        setRole={setRole}
        streak={stats.streak}
        totalStars={stats.totalStars}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-5 sm:px-6">
        {/* Welcome Section */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span>{greeting}</span>
              <span className="text-purple-600">
                {role === "bhanji" ? "Padhai Champ! 🎒" : "Mama Ji! 👨‍🏫"}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {role === "bhanji"
                ? "Aaj kya naya seekhna hai? Khud record karo aur star kamao!"
                : "Bhanji ke daily study updates dekhein, doubts solve karein aur feedback dein."}
            </p>
          </div>

          {role === "mama" && stats.pendingDoubts > 0 && (
            <aside
              role="alert"
              className="bg-rose-100 text-rose-900 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 animate-pulse"
            >
              <HelpCircle className="w-4 h-4 text-rose-600" aria-hidden="true" />
              <span>{stats.pendingDoubts} Doubts waiting for your answer!</span>
            </aside>
          )}
        </div>

        {/* Quick Stats Bar */}
        <StatsBar stats={stats} />

        {/* Accessible Tab Navigation */}
        <nav aria-label="Study tracker sections" className="mb-6">
          <div
            role="tablist"
            aria-label="Tracker Tabs"
            className="flex border-b border-purple-200/70 overflow-x-auto no-scrollbar gap-2 sm:gap-4"
          >
            <button
              role="tab"
              id="tab-daily"
              aria-controls="panel-daily"
              aria-selected={activeTab === "daily"}
              onClick={() => setActiveTab("daily")}
              className={`pb-3 px-3 min-h-[44px] text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                activeTab === "daily"
                  ? "border-purple-600 text-purple-700 font-bold"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Aaj Kya Padha (Daily Log)</span>
              {logs.length > 0 && (
                <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
                  {logs.length}
                </span>
              )}
            </button>

            <button
              role="tab"
              id="tab-planner"
              aria-controls="panel-planner"
              aria-selected={activeTab === "planner"}
              onClick={() => setActiveTab("planner")}
              className={`pb-3 px-3 min-h-[44px] text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                activeTab === "planner"
                  ? "border-blue-600 text-blue-700 font-bold"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Aage Kya Padhna Hai (Planner)</span>
              {stats.upcomingPlans > 0 && (
                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                  {stats.upcomingPlans}
                </span>
              )}
            </button>

            <button
              role="tab"
              id="tab-doubts"
              aria-controls="panel-doubts"
              aria-selected={activeTab === "doubts"}
              onClick={() => setActiveTab("doubts")}
              className={`pb-3 px-3 min-h-[44px] text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                activeTab === "doubts"
                  ? "border-rose-600 text-rose-700 font-bold"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Doubts Box (Sawaal)</span>
              {stats.pendingDoubts > 0 && (
                <span className="text-[10px] bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded-full">
                  {stats.pendingDoubts}
                </span>
              )}
            </button>

            <button
              role="tab"
              id="tab-trophies"
              aria-controls="panel-trophies"
              aria-selected={activeTab === "trophies"}
              onClick={() => setActiveTab("trophies")}
              className={`pb-3 px-3 min-h-[44px] text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                activeTab === "trophies"
                  ? "border-amber-500 text-amber-600 font-bold"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Trophies & Badges 🏆</span>
            </button>
          </div>
        </nav>

        {/* Content Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400" role="status">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
            <p className="text-xs">Loading tracker...</p>
          </div>
        ) : (
          <div>
            <div
              id="panel-daily"
              role="tabpanel"
              aria-labelledby="tab-daily"
              hidden={activeTab !== "daily"}
            >
              {activeTab === "daily" && (
                <DailyLogTab
                  logs={logs}
                  subjects={subjects}
                  role={role}
                  onAddLog={handleAddLog}
                  onUpdateLog={handleUpdateLog}
                  onDeleteLog={handleDeleteLog}
                  onOpenAddSubject={() => setIsSubjectModalOpen(true)}
                />
              )}
            </div>

            <div
              id="panel-planner"
              role="tabpanel"
              aria-labelledby="tab-planner"
              hidden={activeTab !== "planner"}
            >
              {activeTab === "planner" && (
                <PlannerTab
                  plans={plans}
                  subjects={subjects}
                  onAddPlan={handleAddPlan}
                  onTogglePlan={handleTogglePlan}
                  onDeletePlan={handleDeletePlan}
                  onQuickLogToDaily={handleQuickLogToDaily}
                />
              )}
            </div>

            <div
              id="panel-doubts"
              role="tabpanel"
              aria-labelledby="tab-doubts"
              hidden={activeTab !== "doubts"}
            >
              {activeTab === "doubts" && (
                <DoubtBoxTab
                  doubts={doubts}
                  subjects={subjects}
                  role={role}
                  onAddDoubt={handleAddDoubt}
                  onResolveDoubt={handleResolveDoubt}
                  onDeleteDoubt={handleDeleteDoubt}
                />
              )}
            </div>

            <div
              id="panel-trophies"
              role="tabpanel"
              aria-labelledby="tab-trophies"
              hidden={activeTab !== "trophies"}
            >
              {activeTab === "trophies" && (
                <TrophyTab
                  logs={logs}
                  doubts={doubts}
                  plans={plans}
                  subjects={subjects}
                  stats={stats}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Native Add Subject Modal Dialog */}
      <AddSubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onAddSubject={handleAddSubject}
      />

      {/* Footer */}
      <footer className="py-4 border-t border-purple-100 bg-white/60 text-center text-xs text-slate-500">
        Meri Padhai Tracker • Padhai karo, aage badho! 🌟
      </footer>
    </div>
  );
}
