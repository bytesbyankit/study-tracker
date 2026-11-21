import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    const where = date ? { date } : {};
    const logs = await prisma.studyLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching study logs:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, subject, topic, timeSpentMinutes, confidence, notes } = body;

    if (!date || !subject || !topic) {
      return NextResponse.json(
        { error: "Date, Subject, and Topic are required" },
        { status: 400 }
      );
    }

    const log = await prisma.studyLog.create({
      data: {
        date,
        subject,
        topic,
        timeSpentMinutes: Number(timeSpentMinutes) || 30,
        confidence: confidence || "GREAT",
        notes: notes || null,
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("Error creating study log:", error);
    return NextResponse.json({ error: "Failed to create log" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, mamaStars, mamaFeedback, notes, confidence } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (mamaStars !== undefined) updateData.mamaStars = Number(mamaStars);
    if (mamaFeedback !== undefined) updateData.mamaFeedback = mamaFeedback;
    if (notes !== undefined) updateData.notes = notes;
    if (confidence !== undefined) updateData.confidence = confidence;

    const updated = await prisma.studyLog.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating study log:", error);
    return NextResponse.json({ error: "Failed to update log" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.studyLog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting study log:", error);
    return NextResponse.json({ error: "Failed to delete log" }, { status: 500 });
  }
}

