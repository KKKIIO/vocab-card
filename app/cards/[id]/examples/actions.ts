"use server";
import logger from "lib/logger";
import prisma from "lib/prisma";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { zfd } from "zod-form-data";
import { DefaultResponse, Response } from "../../../../lib/response";
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
  try {
    const data = createExampleSchema.parse(formData);
    // check card exists
    const card = await prisma.card.findUnique({
      where: { id: data.cardId },
    });
    if (!card) {
      return { error: { message: "Card not found" } };
    }
    // check start and end are valid
    if (data.cardTextStart >= data.cardTextEnd || data.cardTextStart < 0) {
      return { error: { message: "Invalid start and end" } };
    }
    if (data.cardTextEnd > card.text.length) {
      return { error: { message: "Invalid start and end" } };
    }
    // check text matches
    const text = card.text.slice(data.cardTextStart, data.cardTextEnd);
    if (data.text !== text) {
      return { error: { message: "Text doesn't match" } };
    }
    // create new meaning example
    await prisma.wordMeaningExample.create({
      data: {
        cardId: data.cardId,
        cardTextStart: data.cardTextStart,
        cardTextEnd: data.cardTextEnd,
        text,
      },
    });
    revalidatePath(`/cards/${data.cardId}`);
    return DefaultResponse();
  } catch (e) {
    logger.error(e);
    const message = makeErrorMessage(e);
    return { error: { message } };
  }
  // TODO: handle error
}

const deleteExampleSchema = zfd.formData({
  id: zfd.numeric(),
});

export async function deleteExample(
  _: Response,
  formData: FormData
): Promise<Response> {
  try {
    const data = deleteExampleSchema.parse(formData);
    const example = await prisma.wordMeaningExample.findUnique({
      where: { id: data.id },
    });
    if (!example) {
      return { error: { message: "Example not found" } };
    }
    const cardId = example.cardId;
    await prisma.wordMeaningExample.delete({
      where: { id: data.id },
    });
    revalidatePath(`/cards/${cardId}`);
    return DefaultResponse();
  } catch (e) {
    const message = makeErrorMessage(e);
    return { error: { message } };
  }
}

function makeErrorMessage(e: any): string {
  if (e instanceof ZodError) {
    return JSON.stringify(e);
  } else {
    logger.error(e, "Failed to call action");
    return "Internal error";
  }
}
