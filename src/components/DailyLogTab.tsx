"use client";

import React, { useState, useEffect, useId } from "react";
import { StudyLog, SubjectItem } from "@/lib/types";
import { fireCelebration, fireStars } from "@/lib/confetti";
import { Plus, Clock, Star, Trash2, MessageSquare } from "lucide-react";

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
  const dateInputId = useId();
  const subjectInputId = useId();
  const topicInputId = useId();
  const notesInputId = useId();
  const filterDateId = useId();

  const [date, setDate] = useState("");
  const [todayStr, setTodayStr] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || "Mathematics");
  const [topic, setTopic] = useState("");
  const [timeSpent, setTimeSpent] = useState<number>(30);
  const [confidence, setConfidence] = useState<"GREAT" | "CONFUSED" | "HARD">("GREAT");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterDate, setFilterDate] = useState<string>("");

  // Feedback modal
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [starsGiven, setStarsGiven] = useState(5);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setTodayStr(today);
    setDate(today);
  }, []);

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
    { value: "GREAT", label: "Samajh gaya! 😊", color: "bg-emerald-50 text-emerald-800 border-emerald-300" },
    { value: "CONFUSED", label: "Thoda doubt hai 🤔", color: "bg-amber-50 text-amber-800 border-amber-300" },
    { value: "HARD", label: "Mushkil laga 🤯", color: "bg-rose-50 text-rose-800 border-rose-300" },
  ];

  const filteredLogs = filterDate ? logs.filter((l) => l.date === filterDate) : logs;

  return (
    <div className="space-y-6">
      {/* Daily Form */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-purple-100/90">
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">📝</span>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Aaj Maine Kya Padha?
              </h2>
              <p className="text-xs text-slate-500">
                Apna study topic aur time yahan record karo
              </p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-semibold">
            Daily Entry
          </span>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date Picker */}
            <div>
              <label htmlFor={dateInputId} className="block text-xs font-semibold text-slate-700 mb-1.5">
                📅 Padhai Ki Tareekh (Date) <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <input
                id={dateInputId}
                name="studyDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-base sm:text-sm px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 bg-slate-50/50"
                required
              />
            </div>

            {/* Subject Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor={subjectInputId} className="text-xs font-semibold text-slate-700">
                  📚 Subject <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <button
                  type="button"
                  onClick={onOpenAddSubject}
                  className="text-xs text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-0.5 p-1 min-h-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5" /> Naya Subject
                </button>
              </div>
              <select
                id={subjectInputId}
                name="subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full text-base sm:text-sm px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 bg-white"
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
            <label htmlFor={topicInputId} className="block text-xs font-semibold text-slate-700 mb-1.5">
              📖 Kya Padha? (Topic / Chapter Name) <span className="text-rose-500" aria-hidden="true">*</span>
            </label>
            <input
              id={topicInputId}
              name="topic"
              type="text"
              placeholder="e.g. Chapter 4: Fractions Exercise 4.2"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full text-base sm:text-sm px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              required
            />
          </div>

          {/* Time Spent Fieldset */}
          <fieldset className="border-0 p-0 m-0">
            <legend className="block text-xs font-semibold text-slate-700 mb-1.5">
              ⏱️ Kitni Der Padha?
            </legend>
            <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Study duration options">
              {timeOptions.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  role="radio"
                  aria-checked={timeSpent === mins}
                  onClick={() => setTimeSpent(mins)}
                  className={`text-xs px-3.5 py-2.5 min-h-[44px] rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                    timeSpent === mins
                      ? "bg-purple-600 text-white shadow-sm shadow-purple-200 font-semibold"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {mins >= 60 ? `${mins / 60} hr` : `${mins} mins`}
                </button>
              ))}
              <div className="flex items-center gap-1.5 ml-1">
                <input
                  type="number"
                  name="customMinutes"
                  aria-label="Custom study minutes"
                  min="5"
                  max="360"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(Number(e.target.value))}
                  className="w-20 text-sm px-2.5 py-2 min-h-[44px] rounded-xl border border-slate-300 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                />
                <span className="text-xs text-slate-500">mins</span>
              </div>
            </div>
          </fieldset>

          {/* Confidence Rating Fieldset */}
          <fieldset className="border-0 p-0 m-0">
            <legend className="block text-xs font-semibold text-slate-700 mb-1.5">
              💡 Kaisa Raha? (Kitna samajh aaya)
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Confidence level selection">
              {confidenceOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={confidence === opt.value}
                  onClick={() => setConfidence(opt.value as any)}
                  className={`text-xs sm:text-sm py-2.5 px-3 min-h-[44px] rounded-xl border font-medium text-center transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                    confidence === opt.value
                      ? `${opt.color} ring-2 ring-purple-500 font-semibold shadow-sm`
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Notes */}
          <div>
            <label htmlFor={notesInputId} className="block text-xs font-semibold text-slate-700 mb-1.5">
              📝 Notes / Kuch Khaas Seekha? (Optional)
            </label>
            <textarea
              id={notesInputId}
              name="notes"
              rows={2}
              placeholder="e.g. Formula yaad kiya, ya 10 sawaal solve kiye..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-base sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !topic.trim()}
            className="w-full py-3.5 px-4 min-h-[48px] rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-purple-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <span>Save Padhai Entry 🎉</span>
          </button>
        </form>
      </section>

      {/* History */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span>📚 Padhai History</span>
            <span className="text-xs font-normal text-slate-500">
              ({filteredLogs.length} entries)
            </span>
          </h3>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor={filterDateId} className="text-xs text-slate-600 font-medium">
              Filter:
            </label>
            <input
              id={filterDateId}
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="text-xs px-2.5 py-1.5 min-h-[36px] rounded-lg border border-slate-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            />
            {filterDate && (
              <button
                type="button"
                onClick={() => setFilterDate("")}
                className="text-xs text-purple-600 hover:underline font-medium min-h-[36px] px-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-4xl mb-2" aria-hidden="true">📖</p>
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
                <article
                  key={log.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg" aria-hidden="true">{matchedSub?.icon || "📚"}</span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                          {log.subject}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        {isToday && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                            TODAY
                          </span>
                        )}
                        <time dateTime={log.date}>{log.date}</time>
                      </div>
                    </div>

                    <h4 className="text-base font-semibold text-slate-800 mt-1">
                      {log.topic}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {log.timeSpentMinutes} mins
                      </span>

                      {log.confidence === "GREAT" && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                          😊 Samajh gaya!
                        </span>
                      )}
                      {log.confidence === "CONFUSED" && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                          🤔 Thoda doubt tha
                        </span>
                      )}
                      {log.confidence === "HARD" && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                          🤯 Mushkil laga
                        </span>
                      )}
                    </div>

                    {log.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl mt-3 border border-slate-100">
                        💬 &ldquo;{log.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Feedback */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1" aria-label={`Rating: ${log.mamaStars || 0} out of 5 stars`}>
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
                          <span className="text-xs font-bold text-amber-800 ml-1">
                            {log.mamaStars}★
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {role === "mama" && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveFeedbackId(log.id);
                              setStarsGiven(log.mamaStars || 5);
                              setFeedbackText(log.mamaFeedback || "");
                            }}
                            className="text-xs px-3 py-1.5 min-h-[36px] rounded-lg bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            {log.mamaStars > 0 ? "Edit Review" : "Rate & Feedback"}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Kya aap yeh entry delete karna chahte hain?")) {
                              onDeleteLog(log.id);
                            }
                          }}
                          aria-label={`Delete study entry for ${log.topic}`}
                          className="text-slate-400 hover:text-rose-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {log.mamaFeedback && (
                      <div className="mt-2 text-xs bg-indigo-50 border border-indigo-100 rounded-xl p-2.5 text-indigo-950 flex items-start gap-1.5">
                        <span aria-hidden="true">👨‍🏫</span>
                        <div>
                          <span className="font-semibold text-indigo-900">Mama&apos;s Note:</span>{" "}
                          <span>{log.mamaFeedback}</span>
                        </div>
                      </div>
                    )}

                    {activeFeedbackId === log.id && (
                      <div className="mt-3 p-3.5 bg-purple-50 rounded-xl border border-purple-200 space-y-2.5">
                        <div className="text-xs font-semibold text-purple-900">
                          🌟 Give Stars to Bhanji:
                        </div>
                        <div className="flex gap-2" role="radiogroup" aria-label="Star rating options">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              role="radio"
                              aria-checked={starsGiven === s}
                              aria-label={`${s} star`}
                              onClick={() => setStarsGiven(s)}
                              className={`p-2 min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                                s <= starsGiven ? "text-amber-500" : "text-slate-300"
                              }`}
                            >
                              <Star className={`w-5 h-5 ${s <= starsGiven ? "fill-amber-400" : ""}`} />
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          aria-label="Feedback comment for Bhanji"
                          placeholder="e.g. Shabash! Bahut accha kiya beta 🎉"
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          className="w-full text-base sm:text-xs px-3 py-2 min-h-[38px] rounded-lg border border-purple-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveFeedbackId(null)}
                            className="text-xs px-3 py-1.5 min-h-[36px] text-slate-600 hover:underline"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveFeedback(log.id)}
                            className="text-xs px-4 py-1.5 min-h-[36px] rounded-lg bg-indigo-600 text-white font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                          >
                            Save Review ⭐
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
