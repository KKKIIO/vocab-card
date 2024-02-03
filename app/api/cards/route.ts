import { authenticatedUser } from "lib/auth";
import prisma from "lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireDefaultDesk } from "../../desks/query";
import { createCard } from "./core";

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
  const userId = (await authenticatedUser()).id;
  const desk = await requireDefaultDesk(userId);
  const body = await request.json();
  const { text, imageUrl, source } = createSchema.parse(body);
  const deskId = desk.id;
  const sourceId = source
    ? (
        await prisma.source.upsert({
          where: { deskId_url: { deskId, url: source.url } },
          update: {},
          create: {
            ...source,
            deskId,
          },
        })
      ).id
    : null;
  const card = await createCard({ text, imageUrl, sourceId, desk: desk });
  revalidatePath("/cards");
  return NextResponse.json({ data: card });
}
