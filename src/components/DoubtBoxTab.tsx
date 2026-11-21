"use client";

import React, { useState } from "react";
import { Doubt, SubjectItem } from "@/lib/types";
import { fireCelebration, fireStars } from "@/lib/confetti";
import { HelpCircle, CheckCircle, Plus, BookOpen, Trash2, Check, MessageSquare } from "lucide-react";

interface DoubtBoxTabProps {
  doubts: Doubt[];
  subjects: SubjectItem[];
  role: "bhanji" | "mama";
  onAddDoubt: (doubtData: {
    subject: string;
    topic?: string;
    question: string;
    bookReference?: string;
  }) => Promise<void>;
  onResolveDoubt: (id: string, resolutionNotes?: string) => Promise<void>;
  onDeleteDoubt: (id: string) => Promise<void>;
}

export default function DoubtBoxTab({
  doubts,
  subjects,
  role,
  onAddDoubt,
  onResolveDoubt,
  onDeleteDoubt,
}: DoubtBoxTabProps) {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || "Mathematics");
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [bookRef, setBookRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "SOLVED">("PENDING");

  // Inline solving state for Mama
  const [activeDoubtId, setActiveDoubtId] = useState<string | null>(null);
  const [solutionText, setSolutionText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddDoubt({
        subject: selectedSubject,
        topic: topic.trim() || undefined,
        question: question.trim(),
        bookReference: bookRef.trim() || undefined,
      });

      setQuestion("");
      setTopic("");
      setBookRef("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSolve = async (doubtId: string) => {
    await onResolveDoubt(doubtId, solutionText.trim() || undefined);
    fireStars();
    setActiveDoubtId(null);
    setSolutionText("");
  };

  const filteredDoubts = doubts.filter((d) => {
    if (filter === "PENDING") return d.status === "PENDING";
    if (filter === "SOLVED") return d.status === "SOLVED";
    return true;
  });

  const pendingCount = doubts.filter((d) => d.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Ask Doubt Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-rose-100/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">❓</span>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Mere Sawaal / Doubts Box
              </h2>
              <p className="text-xs text-slate-500">
                Koi sawal samajh nahi aaya? Yahan likh kar Mama se poochho!
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full font-medium">
            Doubt Corner
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                📚 Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.icon} {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter / Topic */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                📖 Chapter / Topic (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Chapter 3: Geometry"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
          </div>

          {/* Question / Doubt */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              ❓ Kya Samajh Nahi Aaya? (Sawaal Likhhein)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Question no. 4 mein x ki value kaise nikali? Formula kaise lagate hain?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
              required
            />
          </div>

          {/* Book / Page Reference */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              📚 Book Name & Page No. (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. NCERT Page 64, Question 7(b)"
              value={bookRef}
              onChange={(e) => setBookRef(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !question.trim()}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-sm shadow-md shadow-rose-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Mama Se Poochho 💡</span>
          </button>
        </form>
      </div>

      {/* Doubts List */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
            <span>💡 Sawaalo Ki List</span>
            {pendingCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                {pendingCount} Pending
              </span>
            )}
          </h3>

          {/* Filter Pills */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setFilter("PENDING")}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === "PENDING"
                  ? "bg-white text-rose-700 font-semibold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Mama Se Poochna Hai ({pendingCount})
            </button>
            <button
              onClick={() => setFilter("SOLVED")}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === "SOLVED"
                  ? "bg-white text-emerald-700 font-semibold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Samajh Aa Gaya ({doubts.filter((d) => d.status === "SOLVED").length})
            </button>
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === "ALL"
                  ? "bg-white text-slate-800 font-semibold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sabhi ({doubts.length})
            </button>
          </div>
        </div>

        {filteredDoubts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-4xl mb-2">🎉</p>
            <h4 className="text-sm font-semibold text-slate-700">Koi doubt pending nahi hai!</h4>
            <p className="text-xs text-slate-400 mt-1">
              Jab bhi padhte waqt koi cheez samajh na aaye, yahan note kar lena.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDoubts.map((doubt) => {
              const matchedSub = subjects.find((s) => s.name === doubt.subject);
              const isSolved = doubt.status === "SOLVED";

              return (
                <div
                  key={doubt.id}
                  className={`bg-white rounded-2xl p-5 border transition-all ${
                    isSolved
                      ? "border-emerald-200 bg-emerald-50/20"
                      : "border-rose-100 shadow-sm hover:border-rose-300"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {matchedSub?.icon || "📚"} {doubt.subject}
                      </span>
                      {doubt.topic && (
                        <span className="text-xs text-slate-500 font-medium">
                          • {doubt.topic}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isSolved ? (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Solved
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
                          Poochna Hai
                        </span>
                      )}

                      <button
                        onClick={() => {
                          if (confirm("Kya aap yeh doubt delete karna chahte hain?")) {
                            onDeleteDoubt(doubt.id);
                          }
                        }}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        title="Delete doubt"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="my-2">
                    <p className="text-sm sm:text-base font-semibold text-slate-800 whitespace-pre-wrap">
                      {doubt.question}
                    </p>
                    {doubt.bookReference && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                        <BookOpen className="w-3 h-3 text-slate-400" />
                        {doubt.bookReference}
                      </p>
                    )}
                  </div>

                  {/* Uncle Solution / Notes */}
                  {doubt.resolutionNotes && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950">
                      <div className="font-semibold text-emerald-800 flex items-center gap-1 mb-1">
                        <span>👨‍🏫 Mama&apos;s Solution / Explanation:</span>
                      </div>
                      <p className="whitespace-pre-wrap">{doubt.resolutionNotes}</p>
                    </div>
                  )}

                  {/* Uncle Action Toolbar */}
                  {!isSolved && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs text-slate-400">
                        Asked on {new Date(doubt.createdAt).toLocaleDateString()}
                      </span>

                      {role === "mama" ? (
                        <button
                          onClick={() => {
                            setActiveDoubtId(doubt.id);
                            setSolutionText(doubt.resolutionNotes || "");
                          }}
                          className="text-xs px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Answer & Mark Solved
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSolve(doubt.id)}
                          className="text-xs px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold flex items-center gap-1 border border-emerald-200"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Samajh aa gaya! (Mark Solved)
                        </button>
                      )}
                    </div>
                  )}

                  {/* Mama Inline Answer Box */}
                  {activeDoubtId === doubt.id && (
                    <div className="mt-3 p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-3">
                      <label className="block text-xs font-semibold text-indigo-950">
                        👨‍🏫 Solution ya Samajhane ke Notes likhein:
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Formula, steps ya explanation likhein..."
                        value={solutionText}
                        onChange={(e) => setSolutionText(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveDoubtId(null)}
                          className="text-xs px-3 py-1.5 text-slate-500 hover:underline"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSolve(doubt.id)}
                          className="text-xs px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Save Solution & Mark Solved 🎉
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

