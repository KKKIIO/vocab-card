import prisma from "lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  text: z.string().min(1).max(1000),
  imageUrl: z.string().url().max(1000).optional(),
  source: z
    .object({
      url: z.string().url().max(1000),
      name: z.string().max(1000),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { text, imageUrl, source } = createSchema.parse(body);
  const sourceId = source
    ? (
        await prisma.source.upsert({
          where: { url: source.url },
          update: {},
          create: source,
        })
      ).id
    : null;
  const card = await prisma.card.create({
    data: {
      text,
      imageUrl,
      sourceId,
    },
  });
  revalidatePath("/cards");
  return NextResponse.json({ data: card });
}
