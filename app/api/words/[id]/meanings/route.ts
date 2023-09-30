import { LearnStatus } from "@prisma/client";
import prisma from "lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
const createSchema = z.object({
  explanation: z.string().min(1).max(1000),
});
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { explanation } = createSchema.parse(body);
  const meaning = await prisma.wordMeaning.create({
    data: {
      wordId: Number(params.id),
      explanation,
      learnStatus: LearnStatus.Learning,
    },
  });
  return NextResponse.json({ data: meaning });
}
