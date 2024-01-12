"use server";
import { requireDefaultDesk } from "app/desks/query";
import { authenticatedUser } from "lib/auth";
import prisma from "lib/prisma";
import { MakeValidateError, Response } from "lib/response";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { zfd } from "zod-form-data";

const editCardSchema = zfd.formData({
  id: zfd.numeric(),
  sourceName: zfd.text(z.string().optional()),
  sourceUrl: zfd.text(z.string().url().optional()),
  text: zfd.text(),
  imageUrl: zfd.text(z.string().url().optional()),
});

export async function editCard(
  _: Response,
  formData: FormData
): Promise<Response> {
  const parsed = editCardSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: MakeValidateError(parsed.error) };
  }
  const { id, sourceName, sourceUrl, text, imageUrl } = parsed.data;
  const userId = (await authenticatedUser()).id;
  const desk = await requireDefaultDesk(userId);
  let source: { name: string; url: string } | null = null;
  if (sourceName && sourceUrl) {
    source = { name: sourceName, url: sourceUrl };
  } else if (sourceName || sourceUrl) {
    return {
      error: {
        message: "Source name and URL must be both present or both absent.",
      },
    };
  }

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
  const card = await prisma.card.update({
    data: {
      deskId,
      text,
      imageUrl,
      sourceId,
    },
    where: { id, deskId },
  });
  revalidatePath("/cards");
  redirect(`/cards/${card.id}`);
}
