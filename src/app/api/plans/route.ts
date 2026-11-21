import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.planItem.findMany({
      orderBy: [{ isCompleted: "asc" }, { targetDate: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetDate, subject, topic, priority, notes } = body;

    if (!targetDate || !subject || !topic) {
      return NextResponse.json(
        { error: "Target Date, Subject, and Topic are required" },
        { status: 400 }
      );
    }

    const plan = await prisma.planItem.create({
      data: {
        targetDate,
        subject,
        topic,
        priority: priority || "MEDIUM",
        notes: notes || null,
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating plan item:", error);
    return NextResponse.json({ error: "Failed to create plan item" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isCompleted, topic, subject, targetDate, priority, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (isCompleted !== undefined) updateData.isCompleted = Boolean(isCompleted);
    if (topic !== undefined) updateData.topic = topic;
    if (subject !== undefined) updateData.subject = subject;
    if (targetDate !== undefined) updateData.targetDate = targetDate;
    if (priority !== undefined) updateData.priority = priority;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await prisma.planItem.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating plan item:", error);
    return NextResponse.json({ error: "Failed to update plan item" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.planItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting plan item:", error);
    return NextResponse.json({ error: "Failed to delete plan item" }, { status: 500 });
  }
}

