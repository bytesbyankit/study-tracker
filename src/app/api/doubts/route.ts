import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where = status ? { status } : {};
    const doubts = await prisma.doubt.findMany({
      where,
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(doubts);
  } catch (error) {
    console.error("Error fetching doubts:", error);
    return NextResponse.json({ error: "Failed to fetch doubts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, topic, question, bookReference } = body;

    if (!subject || !question) {
      return NextResponse.json(
        { error: "Subject and Question are required" },
        { status: 400 }
      );
    }

    const doubt = await prisma.doubt.create({
      data: {
        subject,
        topic: topic || null,
        question,
        bookReference: bookReference || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(doubt, { status: 201 });
  } catch (error) {
    console.error("Error creating doubt:", error);
    return NextResponse.json({ error: "Failed to create doubt" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, resolutionNotes, question, bookReference, topic } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) {
      updateData.status = status;
      if (status === "SOLVED") {
        updateData.solvedAt = new Date();
      } else {
        updateData.solvedAt = null;
      }
    }
    if (resolutionNotes !== undefined) updateData.resolutionNotes = resolutionNotes;
    if (question !== undefined) updateData.question = question;
    if (bookReference !== undefined) updateData.bookReference = bookReference;
    if (topic !== undefined) updateData.topic = topic;

    const updated = await prisma.doubt.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating doubt:", error);
    return NextResponse.json({ error: "Failed to update doubt" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.doubt.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting doubt:", error);
    return NextResponse.json({ error: "Failed to delete doubt" }, { status: 500 });
  }
}

