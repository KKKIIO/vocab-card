import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "../../../lib/prisma";

export async function GET(request: NextRequest) {
  // search by text
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get("text");
  const word = await prisma.word.findUnique({
    where: {
      text,
    },
    include: {
      wordMeanings: {
        select: {
          id: true,
          explanation: true,
          createdAt: true,
        },
      },
    },
  });
  return NextResponse.json({ data: word });
}

const createSchema = z.object({
  text: z.string().min(1).max(50),
});

export async function POST(request: Request) {
  const body = await request.json();
  const { text } = createSchema.parse(body);
  const word = await prisma.word.create({
    data: {
      text,
    },
  });
  return NextResponse.json({ data: word });
}
