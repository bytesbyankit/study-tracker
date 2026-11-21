import confetti from "canvas-confetti";

export function fireCelebration() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#ec4899", "#8b5cf6", "#10b981", "#f59e0b"],
    });
  } catch (e) {
    console.error("Confetti error:", e);
  }
}

export function fireStars() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      shapes: ["star"],
      colors: ["#fbbf24", "#f59e0b", "#fde047"],
    });
  } catch (e) {
    console.error("Star confetti error:", e);
  }
}

