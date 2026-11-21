"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import { X, Plus } from "lucide-react";

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSubject: (subject: { name: string; icon: string; color: string }) => Promise<void>;
}

export default function AddSubjectModal({
  isOpen,
  onClose,
  onAddSubject,
}: AddSubjectModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();
  const nameInputId = useId();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📚");
  const [color] = useState("purple");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync dialog visibility using native showModal() / close()
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Handle native cancel (Esc key or light dismiss)
  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  // Light dismiss on backdrop click
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isClickOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (isClickOutside) {
      onClose();
    }
  };

  const emojiOptions = ["📚", "📐", "🔬", "💻", "🎨", "✍️", "🌍", "💡", "🎵", "📜", "🧪", "⚽"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddSubject({ name: name.trim(), icon, color });
      setName("");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleDialogClick}
      aria-labelledby={titleId}
      className="backdrop:bg-black/40 backdrop:backdrop-blur-sm p-0 rounded-3xl shadow-2xl border border-purple-100 max-w-sm w-full mx-auto my-auto overflow-hidden animate-fade-in"
      style={{ overscrollBehavior: "contain" }}
    >
      <div className="p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 id={titleId} className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span>✨ Naya Subject Add Karein</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Dialog band karein"
            className="text-slate-400 hover:text-slate-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor={nameInputId} className="block text-xs font-semibold text-slate-700 mb-1.5">
              Subject Name <span className="text-rose-500" aria-hidden="true">*</span>
            </label>
            <input
              id={nameInputId}
              type="text"
              name="subjectName"
              placeholder="e.g. Drawing, Sanskrit, History"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-base sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              required
              autoFocus
            />
          </div>

          <fieldset className="border-0 p-0 m-0">
            <legend className="block text-xs font-semibold text-slate-700 mb-1.5">
              Choose an Icon
            </legend>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Subject icon selection">
              {emojiOptions.map((em) => (
                <button
                  key={em}
                  type="button"
                  role="radio"
                  aria-checked={icon === em}
                  aria-label={`Select icon ${em}`}
                  onClick={() => setIcon(em)}
                  className={`w-11 h-11 min-h-[44px] min-w-[44px] rounded-xl text-lg flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                    icon === em
                      ? "bg-purple-100 ring-2 ring-purple-600 scale-105"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 min-h-[44px] text-xs font-semibold text-slate-600 hover:underline flex items-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-5 py-2.5 min-h-[44px] rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-200 disabled:opacity-50 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
