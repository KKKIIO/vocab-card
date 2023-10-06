"use server";
import prisma from "lib/prisma";
import { revalidatePath } from "next/cache";
import { zfd } from "zod-form-data";
const schema = zfd.formData({
  cardId: zfd.numeric(),
  wordId: zfd.numeric(),
  meaningId: zfd.numeric(),
});

export async function setWordMeaningExample(
  prevState: any,
  formData: FormData
) {
  const data = schema.parse(formData);
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
