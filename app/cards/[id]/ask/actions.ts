"use server";
import prisma from "lib/prisma";
import { MakeValidateError, Response } from "lib/response";
import { zfd } from "zod-form-data";

import { openai } from "lib/gpt";

const gptApiBaseUrl = process.env.GPT_API_BASE_URL;

const askWordMeaningSchema = zfd.formData({
  cardId: zfd.numeric(),
  text: zfd.text(),
});

export type GptMessage = {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function askWordMeaning(
  _: Response<GptMessage[]>,
  formData: FormData
): Promise<Response<GptMessage[]>> {
  const parsed = askWordMeaningSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: MakeValidateError(parsed.error) };
  }
  const { cardId, text } = parsed.data;
  // check card exists
  const card = await prisma.card.findUnique({
    where: { id: cardId },
  });
  if (!card) {
    return { error: { message: "Card not found" } };
  }
  const word = text.trim();
  // check word exists in card
  if (!card.text.includes(word)) {
    return { error: { message: "Word not found in card" } };
  }
  const messages: GptMessage[] = [
    {
      "role": "user",
      "content": `I'm learning English and I'm eager to expand my vocabulary by learning English words within sentences. Could you assist me in understanding the meaning of words within the context of a sentence? The sentence I'm currently learning is: \n<p>${card.text}</p>`
    },
    {
      "role": "assistant",
      "content": "Sure. What word are you interested in learning the meaning of?"
    },
    {
      "role": "user",
      "content": `The word I'm currently learning is '${word}'.`
    }
  ];

  const chatCompletion = await openai.chat.completions.create({
    messages: messages,
    model: 'gpt-3.5-turbo',
  });


  const message = chatCompletion.choices[0].message;
  return {
    data: messages.concat([{
      role: message.role,
      content: message.content!,
    }])
  };
}
