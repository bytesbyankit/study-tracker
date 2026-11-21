"use client";

import React, { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("PWA Service Worker registered:", reg.scope))
        .catch((err) => console.error("Service worker registration failed:", err));
    }

    // 2. Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // 3. Listen for browser install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled || !showBanner || !deferredPrompt) return null;

  return (
    <aside
      role="region"
      aria-label="PWA Installation Prompt"
      className="bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 text-white px-4 py-2.5 rounded-2xl mb-4 shadow-lg flex items-center justify-between gap-3 animate-fade-in"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Download className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold truncate">App Phone me Install karein!</p>
          <p className="text-[11px] text-purple-100 truncate">
            Home screen icon se ek click me open hogi
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleInstallClick}
          className="text-xs font-bold px-3 py-1.5 min-h-[36px] bg-white text-purple-700 rounded-xl shadow-xs hover:bg-purple-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Install App 📲
        </button>
        <button
          type="button"
          aria-label="Dismiss banner"
          onClick={() => setShowBanner(false)}
          className="p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center text-white/80 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
