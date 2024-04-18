"use server";
import { createCard } from "app/api/cards/core";
import { upsertSource } from "app/api/sources/core";
import { requireDefaultDesk } from "app/desks/query";
import * as cheerio from 'cheerio';
import { authenticatedUser } from "lib/auth";
import logger from "lib/logger";
import { MakeValidateError, Response } from "lib/response";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { zfd } from "zod-form-data";

const createCardSchema = zfd.formData({
  sourceName: zfd.text(z.string().optional()),
  sourceUrl: zfd.text(z.string().url().optional()),
  text: zfd.text(),
  imageUrl: zfd.text(z.string().url().optional()),
});

export async function createCardAction(
  _: Response,
  formData: FormData
): Promise<Response> {
  const parsed = createCardSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: MakeValidateError(parsed.error) };
  }
  const { sourceName, sourceUrl, text, imageUrl } = parsed.data;
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
    ? (await upsertSource({ deskId, ...source, })).id
    : null;
  const card = await createCard({
    desk,
    text,
    imageUrl,
    sourceId,
  });
  revalidatePath("/cards");
  redirect(`/cards/${card.id}`);
}

const createCardFromQuoteUrlSchema = zfd.formData({
  quoteUrl: zfd.text(z.string().url()),
});

export async function createCardFromQuoteUrlAction(
  _: Response,
  formData: FormData
): Promise<Response> {

  const parsed = createCardFromQuoteUrlSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: MakeValidateError(parsed.error) };
  }
  const userId = (await authenticatedUser()).id;
  const desk = await requireDefaultDesk(userId);
  const { quoteUrl } = parsed.data;

  const { url: sourceUrl, text } = parseFromQuoteUrlString(quoteUrl);
  const sourceName = (await fetchResourceTitle(sourceUrl)) ?? "Unknown";

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
    ? (await upsertSource({ deskId, ...source, })).id
    : null;
  const card = await createCard({
    desk,
    text,
    sourceId,
  });
  revalidatePath("/cards");
  redirect(`/cards/${card.id}`);
}


async function fetchResourceTitle(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    // Use Cheerio selectors to get title and extract text  
    const title = $('title').text();
    return title;
  } catch (e) {
    logger.warn({ url, err: e }, "Failed to fetch resource title");
    return null;
  }
}

function parseFromQuoteUrlString(fromQuoteUrlString: string): { url: string; text: string } {
  const url = new URL(fromQuoteUrlString);
  const hash = url.hash;
  // drop #:~:text= from hash and urldecode
  const text = decodeURIComponent(hash.slice("#:~:text=".length));
  url.hash = "";
  return {
    url: url.toString(),
    text,
  };
}