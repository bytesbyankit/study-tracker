"use client";

import React, { useState } from "react";
import { PlanItem, SubjectItem } from "@/lib/types";
import { fireCelebration } from "@/lib/confetti";
import { Plus, Check, Calendar, Trash2, ArrowRight } from "lucide-react";

interface PlannerTabProps {
  plans: PlanItem[];
  subjects: SubjectItem[];
  onAddPlan: (planData: {
    targetDate: string;
    subject: string;
    topic: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    notes?: string;
  }) => Promise<void>;
  onTogglePlan: (id: string, isCompleted: boolean) => Promise<void>;
  onDeletePlan: (id: string) => Promise<void>;
  onQuickLogToDaily: (plan: PlanItem) => void;
}

export default function PlannerTab({
  plans,
  subjects,
  onAddPlan,
  onTogglePlan,
  onDeletePlan,
  onQuickLogToDaily,
}: PlannerTabProps) {
  const [targetDate, setTargetDate] = useState("");
  const [todayStr, setTodayStr] = useState("");
  const [tomorrowStr, setTomorrowStr] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || "Mathematics");
  const [topic, setTopic] = useState("");
  const [priority, setPriority] = useState<"HIGH" | "MEDIUM" | "LOW">("MEDIUM");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "COMPLETED">("PENDING");

  React.useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    setTodayStr(today);
    setTomorrowStr(tomorrow);
    setTargetDate(tomorrow);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddPlan({
        targetDate,
        subject: selectedSubject,
        topic: topic.trim(),
        priority,
        notes: notes.trim() || undefined,
      });

      setTopic("");
      setNotes("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (plan: PlanItem) => {
    const newStatus = !plan.isCompleted;
    if (newStatus) {
      fireCelebration();
    }
    await onTogglePlan(plan.id, newStatus);
  };

  const filteredPlans = plans.filter((p) => {
    if (filter === "PENDING") return !p.isCompleted;
    if (filter === "COMPLETED") return p.isCompleted;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Add Plan Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-blue-100/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Aage Kya Padhna Hai?
              </h2>
              <p className="text-xs text-slate-500">
                Kal ya aane wale dino ke study goals plan karo
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
            Study Planner
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Target Date with Quick Buttons */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  📅 Target Date
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setTargetDate(todayStr)}
                    className="text-[10px] text-blue-600 hover:underline font-semibold"
                  >
                    Today
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => setTargetDate(tomorrowStr)}
                    className="text-[10px] text-blue-600 hover:underline font-semibold"
                  >
                    Tomorrow
                  </button>
                </div>
              </div>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50/50"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                📚 Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.icon} {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                ⚡ Priority
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPriority("HIGH")}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    priority === "HIGH"
                      ? "bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-300"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  🔴 Zaroori (Urgent)
                </button>
                <button
                  type="button"
                  onClick={() => setPriority("MEDIUM")}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    priority === "MEDIUM"
                      ? "bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-300"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  🟡 Normal
                </button>
              </div>
            </div>
          </div>

          {/* Topic Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              🎯 Kya Topic Padhna Hai?
            </label>
            <input
              type="text"
              placeholder="e.g. Science: Chapter 5 Periodic Table revision & notes"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              📌 Target Notes / Details (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. NCERT ke pichhle 5 questions solve karne hain"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !topic.trim()}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Target Plan Add Karo 🎯</span>
          </button>
        </form>
      </div>

      {/* Target Items List */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
            <span>📋 Planned Goals</span>
            <span className="text-xs font-normal text-slate-500">
              ({filteredPlans.length} items)
            </span>
          </h3>

          {/* Filter Pills */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setFilter("PENDING")}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === "PENDING"
                  ? "bg-white text-blue-700 font-semibold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Baaki Hai ({plans.filter((p) => !p.isCompleted).length})
            </button>
            <button
              onClick={() => setFilter("COMPLETED")}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === "COMPLETED"
                  ? "bg-white text-emerald-700 font-semibold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Complete Hua ({plans.filter((p) => p.isCompleted).length})
            </button>
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === "ALL"
                  ? "bg-white text-slate-800 font-semibold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sabhi ({plans.length})
            </button>
          </div>
        </div>

        {filteredPlans.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-4xl mb-2">🎯</p>
            <h4 className="text-sm font-semibold text-slate-700">Koi target pending nahi hai!</h4>
            <p className="text-xs text-slate-400 mt-1">
              Kal kya padhna hai, abhi plan add karo!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPlans.map((plan) => {
              const matchedSub = subjects.find((s) => s.name === plan.subject);
              const isToday = plan.targetDate === todayStr;
              const isPast = plan.targetDate < todayStr && !plan.isCompleted;

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    plan.isCompleted
                      ? "border-emerald-200 bg-emerald-50/30 opacity-80"
                      : isPast
                      ? "border-amber-200 bg-amber-50/20"
                      : "border-slate-100 hover:border-blue-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleToggle(plan)}
                      className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        plan.isCompleted
                          ? "bg-emerald-500 text-white ring-2 ring-emerald-200"
                          : "border-2 border-slate-300 hover:border-blue-500 bg-white"
                      }`}
                    >
                      {plan.isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {matchedSub?.icon || "📚"} {plan.subject}
                        </span>

                        {plan.priority === "HIGH" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                            Urgent 🔴
                          </span>
                        )}

                        <span
                          className={`text-xs flex items-center gap-1 ${
                            isPast
                              ? "text-rose-600 font-semibold"
                              : isToday
                              ? "text-blue-600 font-semibold"
                              : "text-slate-500"
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          {isToday ? "Today" : plan.targetDate}
                          {isPast && " (Pending from before)"}
                        </span>
                      </div>

                      <p
                        className={`text-sm sm:text-base font-semibold ${
                          plan.isCompleted
                            ? "line-through text-slate-400"
                            : "text-slate-800"
                        }`}
                      >
                        {plan.topic}
                      </p>

                      {plan.notes && (
                        <p className="text-xs text-slate-500">{plan.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Quick convert to Daily Log if done */}
                    {plan.isCompleted && (
                      <button
                        onClick={() => onQuickLogToDaily(plan)}
                        className="text-xs px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold flex items-center gap-1"
                        title="Add this completed target to today's study log"
                      >
                        <span>Log in Study</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm("Kya aap yeh target delete karna chahte hain?")) {
                          onDeletePlan(plan.id);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-500 p-1.5"
                      title="Delete target"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
