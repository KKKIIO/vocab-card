"use server";
import logger from "lib/logger";
import prisma from "lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function setWordMeaningExample(
  prevState: any,
  formData: FormData
) {
  logger.info({ formData }, "setWordMeaningExample");
  const schema = z.object({
    cardId: z.number(),
    wordId: z.number(),
    meaningId: z.number(),
  });

  const data = schema.parse({
    cardId: Number(formData.get("cardId")),
    wordId: Number(formData.get("wordId")),
    meaningId: Number(formData.get("meaningId")),
  });
  // one word can only have one meaning example in a card(for now)
  // delete all meaning examples of the word in the card
  const meanings = await prisma.wordMeaning.findMany({
    where: {
      wordId: data.wordId,
    },
    select: {
      id: true,
    },
  });
  // validate meaningId
  if (!meanings.find((meaning) => meaning.id === data.meaningId)) {
    throw new Error(
      `Meaning ${data.meaningId} is not found in word ${data.wordId}!`
    );
  }
  await prisma.wordMeaningExample.deleteMany({
    where: {
      cardId: data.cardId,
      wordMeaningId: {
        in: meanings.map((meaning) => meaning.id),
      },
    },
  });
  // create new meaning example
  const meaningExample = await prisma.wordMeaningExample.create({
    data: {
      cardId: data.cardId,
      wordMeaningId: data.meaningId,
    },
  });
  revalidatePath(`/cards/${data.cardId}`);
  // TODO: handle error
}
