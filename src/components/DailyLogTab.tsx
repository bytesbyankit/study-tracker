"use client";

import React, { useState } from "react";
import { StudyLog, SubjectItem } from "@/lib/types";
import { fireCelebration, fireStars } from "@/lib/confetti";
import { Plus, Clock, Star, Trash2, Smile, Meh, Frown, Check, MessageSquare } from "lucide-react";

interface DailyLogTabProps {
  logs: StudyLog[];
  subjects: SubjectItem[];
  role: "bhanji" | "mama";
  onAddLog: (logData: {
    date: string;
    subject: string;
    topic: string;
    timeSpentMinutes: number;
    confidence: "GREAT" | "CONFUSED" | "HARD";
    notes?: string;
  }) => Promise<void>;
  onUpdateLog: (id: string, updateData: Partial<StudyLog>) => Promise<void>;
  onDeleteLog: (id: string) => Promise<void>;
  onOpenAddSubject: () => void;
}

export default function DailyLogTab({
  logs,
  subjects,
  role,
  onAddLog,
  onUpdateLog,
  onDeleteLog,
  onOpenAddSubject,
}: DailyLogTabProps) {
  const [date, setDate] = useState("");
  const [todayStr, setTodayStr] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || "Mathematics");
  const [topic, setTopic] = useState("");
  const [timeSpent, setTimeSpent] = useState<number>(30);
  const [confidence, setConfidence] = useState<"GREAT" | "CONFUSED" | "HARD">("GREAT");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterDate, setFilterDate] = useState<string>("");

  React.useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setTodayStr(today);
    setDate(today);
  }, []);

  // For Mama feedback inline modal
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [starsGiven, setStarsGiven] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddLog({
        date,
        subject: selectedSubject,
        topic: topic.trim(),
        timeSpentMinutes: timeSpent,
        confidence,
        notes: notes.trim() || undefined,
      });

      fireCelebration();
      setTopic("");
      setNotes("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveFeedback = async (logId: string) => {
    await onUpdateLog(logId, {
      mamaStars: starsGiven,
      mamaFeedback: feedbackText.trim() || null,
    });
    fireStars();
    setActiveFeedbackId(null);
    setFeedbackText("");
  };

  const timeOptions = [15, 30, 45, 60, 90, 120];

  const confidenceOptions = [
    { value: "GREAT", label: "Samajh gaya! 😊", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { value: "CONFUSED", label: "Thoda doubt hai 🤔", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { value: "HARD", label: "Mushkil laga 🤯", color: "bg-rose-50 text-rose-700 border-rose-200" },
  ];

  const filteredLogs = filterDate ? logs.filter((l) => l.date === filterDate) : logs;

  return (
    <div className="space-y-6">
      {/* Add Log Section (Especially highlighted for Bhanji) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-purple-100/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Aaj Maine Kya Padha?
              </h2>
              <p className="text-xs text-slate-500">
                Apna study topic aur time yahan record karo
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">
            Daily Entry
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                📅 Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-slate-50/50"
                required
              />
            </div>

            {/* Subject Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  📚 Subject
                </label>
                <button
                  type="button"
                  onClick={onOpenAddSubject}
                  className="text-[11px] text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" /> Naya Subject
                </button>
              </div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.icon} {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Topic Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              📖 Kya Padha? (Topic / Chapter Name)
            </label>
            <input
              type="text"
              placeholder="e.g. Chapter 4: Fractions Exercise 4.2"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          {/* Time Spent Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              ⏱️ Kitni Der Padha?
            </label>
            <div className="flex flex-wrap gap-2">
              {timeOptions.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setTimeSpent(mins)}
                  className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all ${
                    timeSpent === mins
                      ? "bg-purple-600 text-white shadow-sm shadow-purple-200 scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {mins >= 60 ? `${mins / 60} hr` : `${mins} mins`}
                </button>
              ))}
              <input
                type="number"
                min="5"
                max="360"
                value={timeSpent}
                onChange={(e) => setTimeSpent(Number(e.target.value))}
                className="w-20 text-xs px-2.5 py-2 rounded-xl border border-slate-200 text-center"
                title="Custom minutes"
              />
              <span className="text-xs text-slate-400 self-center">mins</span>
            </div>
          </div>

          {/* Confidence / Mood Rating */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              💡 Kaisa Raha? (Kitna samajh aaya)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {confidenceOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setConfidence(opt.value as any)}
                  className={`text-xs sm:text-sm py-2 px-2 rounded-xl border font-medium text-center transition-all ${
                    confidence === opt.value
                      ? `${opt.color} ring-2 ring-purple-400 font-semibold shadow-sm`
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              📝 Notes / Kuch Khaas Seekha? (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Formula yaad kiya, ya 10 sawaal solve kiye..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !topic.trim()}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-purple-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <span>Save Padhai Entry 🎉</span>
          </button>
        </form>
      </div>

      {/* History / Recent Logs Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
            <span>📚 Padhai History</span>
            <span className="text-xs font-normal text-slate-500">
              ({filteredLogs.length} entries)
            </span>
          </h3>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filter by Date:</span>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
            />
            {filterDate && (
              <button
                onClick={() => setFilterDate("")}
                className="text-xs text-purple-600 hover:underline font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-4xl mb-2">📖</p>
            <h4 className="text-sm font-semibold text-slate-700">Koi entry nahi mili</h4>
            <p className="text-xs text-slate-400 mt-1">
              Upar form bhar ke apni pehli study entry add karo!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLogs.map((log) => {
              const matchedSub = subjects.find((s) => s.name === log.subject);
              const isToday = log.date === todayStr;

              return (
                <div
                  key={log.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top row: Subject, Date, Confidence */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{matchedSub?.icon || "📚"}</span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                          {log.subject}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        {isToday && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-semibold">
                            TODAY
                          </span>
                        )}
                        <span>{log.date}</span>
                      </div>
                    </div>

                    {/* Topic Name */}
                    <h4 className="text-base font-semibold text-slate-800 mt-1">
                      {log.topic}
                    </h4>

                    {/* Time & Confidence */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {log.timeSpentMinutes} mins
                      </span>

                      {log.confidence === "GREAT" && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                          😊 Samajh gaya!
                        </span>
                      )}
                      {log.confidence === "CONFUSED" && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                          🤔 Thoda doubt tha
                        </span>
                      )}
                      {log.confidence === "HARD" && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                          🤯 Mushkil laga
                        </span>
                      )}
                    </div>

                    {/* Notes if any */}
                    {log.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl mt-3 border border-slate-100">
                        💬 &ldquo;{log.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Mama's Stars & Feedback Section */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      {/* Star Rating Display */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= (log.mamaStars || 0)
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                        {log.mamaStars > 0 && (
                          <span className="text-xs font-bold text-amber-700 ml-1">
                            {log.mamaStars}★
                          </span>
                        )}
                      </div>

                      {/* Mama Actions or Delete */}
                      <div className="flex items-center gap-2">
                        {role === "mama" && (
                          <button
                            onClick={() => {
                              setActiveFeedbackId(log.id);
                              setStarsGiven(log.mamaStars || 5);
                              setFeedbackText(log.mamaFeedback || "");
                            }}
                            className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            {log.mamaStars > 0 ? "Edit Review" : "Rate & Feedback"}
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (confirm("Kya aap yeh entry delete karna chahte hain?")) {
                              onDeleteLog(log.id);
                            }
                          }}
                          className="text-slate-400 hover:text-rose-500 p-1"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Mama Feedback Note */}
                    {log.mamaFeedback && (
                      <div className="mt-2 text-xs bg-indigo-50/70 border border-indigo-100 rounded-xl p-2 text-indigo-900 flex items-start gap-1.5">
                        <span>👨‍🏫</span>
                        <div>
                          <span className="font-semibold text-indigo-800">Mama&apos;s Note:</span>{" "}
                          <span>{log.mamaFeedback}</span>
                        </div>
                      </div>
                    )}

                    {/* Mama Inline Feedback Box */}
                    {activeFeedbackId === log.id && (
                      <div className="mt-3 p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-2">
                        <div className="text-xs font-semibold text-purple-900">
                          🌟 Give Stars to Bhanji:
                        </div>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setStarsGiven(s)}
                              className={`p-1 rounded-lg transition-transform hover:scale-110 ${
                                s <= starsGiven ? "text-amber-500" : "text-slate-300"
                              }`}
                            >
                              <Star className={`w-5 h-5 ${s <= starsGiven ? "fill-amber-400" : ""}`} />
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. Shabash! Bahut accha kiya beta 🎉"
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          className="w-full text-xs px-3 py-1.5 rounded-lg border border-purple-200 bg-white"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveFeedbackId(null)}
                            className="text-xs px-2.5 py-1 text-slate-500 hover:underline"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveFeedback(log.id)}
                            className="text-xs px-3 py-1 rounded-lg bg-indigo-600 text-white font-semibold shadow-sm"
                          >
                            Save Review ⭐
                          </button>
                        </div>
                      </div>
                    )}
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
