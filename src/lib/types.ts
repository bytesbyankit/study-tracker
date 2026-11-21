export interface StudyLog {
  id: string;
  date: string;
  subject: string;
  topic: string;
  timeSpentMinutes: number;
  confidence: "GREAT" | "CONFUSED" | "HARD";
  notes?: string | null;
  mamaStars: number;
  mamaFeedback?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlanItem {
  id: string;
  targetDate: string;
  subject: string;
  topic: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  isCompleted: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Doubt {
  id: string;
  subject: string;
  topic?: string | null;
  question: string;
  bookReference?: string | null;
  status: "PENDING" | "SOLVED";
  resolutionNotes?: string | null;
  solvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface StatsData {
  todayMinutes: number;
  totalMinutes: number;
  streak: number;
  pendingDoubts: number;
  solvedDoubts: number;
  upcomingPlans: number;
  totalStars: number;
  totalSessions: number;
}

