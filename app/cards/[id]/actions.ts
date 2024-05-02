"use server";
import prisma from "lib/prisma";
import { MakeValidateError, MutResponse, Response } from "lib/response";
import { revalidatePath } from "next/cache";
import { zfd } from "zod-form-data";
const createExampleSchema = zfd.formData({
  cardId: zfd.numeric(),
  cardTextStart: zfd.numeric(),
  cardTextEnd: zfd.numeric(),
  text: zfd.text(),
});

export async function createExample(
  _: Response,
  formData: FormData
): Promise<Response> {
  const parsed = createExampleSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: MakeValidateError(parsed.error) };
  }
  const { cardId, cardTextStart, cardTextEnd, text } = parsed.data;
  // check card exists
  const card = await prisma.card.findUnique({
    where: { id: cardId },
  });
  if (!card) {
    return { error: { message: "Card not found" } };
  }
  // check start and end are valid
  if (cardTextStart >= cardTextEnd || cardTextStart < 0) {
    return { error: { message: "Invalid start and end" } };
  }
  if (cardTextEnd > card.text.length) {
    return { error: { message: "Invalid start and end" } };
  }
  // text should not prefix or suffix with whitespace
  if (text.trim() !== text) {
    return { error: { message: "Text should not prefix or suffix with whitespace" } };
  }
  // text should match the range
  const rangeCutText = card.text.slice(cardTextStart, cardTextEnd);
  if (text !== rangeCutText) {
    return { error: { message: `Text='${text}' should match the rangeCutText='${rangeCutText}'` } }
  }
  // create new meaning example
  await prisma.wordMeaningExample.create({
    data: {
      cardId: cardId,
      cardTextStart: cardTextStart,
      cardTextEnd: cardTextEnd,
      text,
    },
  });
  revalidatePath(`/cards/${cardId}`);
  return MutResponse();
}

const deleteExampleSchema = zfd.formData({
  id: zfd.numeric(),
});

export async function deleteExample(
  _: Response,
  formData: FormData
): Promise<Response> {
  // const data = deleteExampleSchema.parse(formData);
  const parsed = deleteExampleSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: MakeValidateError(parsed.error) };
  }
  const { id } = parsed.data;
  const example = await prisma.wordMeaningExample.findUnique({
    where: { id },
  });
  if (!example) {
    return { error: { message: "Example not found" } };
  }
  const cardId = example.cardId;
  await prisma.wordMeaningExample.delete({
    where: { id },
  });
  revalidatePath(`/cards/${cardId}`);
  return MutResponse();
}
