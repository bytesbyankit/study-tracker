import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const todayStr = new Date().toISOString().split("T")[0];

    const [todayLogs, allLogs, pendingDoubts, solvedDoubts, upcomingPlans] =
      await Promise.all([
        prisma.studyLog.findMany({ where: { date: todayStr } }),
        prisma.studyLog.findMany({
          select: { date: true, mamaStars: true, timeSpentMinutes: true },
          orderBy: { date: "desc" },
        }),
        prisma.doubt.count({ where: { status: "PENDING" } }),
        prisma.doubt.count({ where: { status: "SOLVED" } }),
        prisma.planItem.count({ where: { isCompleted: false } }),
      ]);

    const todayMinutes = todayLogs.reduce((sum, l) => sum + l.timeSpentMinutes, 0);
    const totalStars = allLogs.reduce((sum, l) => sum + (l.mamaStars || 0), 0);
    const totalMinutes = allLogs.reduce((sum, l) => sum + l.timeSpentMinutes, 0);

    // Calculate streak
    const uniqueDates = Array.from(new Set(allLogs.map((l) => l.date))).sort().reverse();
    let streak = 0;
    if (uniqueDates.length > 0) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      let checkDate = new Date(today);
      // If no log today yet, check if there was a log yesterday to maintain streak
      const hasToday = uniqueDates.includes(todayStr);
      if (!hasToday) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      for (let i = 0; i < 365; i++) {
        const dStr = checkDate.toISOString().split("T")[0];
        if (uniqueDates.includes(dStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return NextResponse.json({
      todayMinutes,
      totalMinutes,
      streak,
      pendingDoubts,
      solvedDoubts,
      upcomingPlans,
      totalStars,
      totalSessions: allLogs.length,
    });
  } catch (error) {
    console.error("Error computing stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

