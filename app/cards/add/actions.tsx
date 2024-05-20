"use server";
import { createCard } from "app/api/cards/core";
import { createSourceIfNotExists } from "app/api/sources/core";
import { requireDefaultDesk } from "app/desks/query";
import * as cheerio from "cheerio";
import { authenticatedUser } from "lib/auth";
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
    ? (await createSourceIfNotExists({ deskId, ...source })).id
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

  let quote: Quote;
  try {
    quote = await parseFromQuoteUrlString(quoteUrl);
  } catch (e) {
    return {
      error: {
        message: `Failed to fetch resource title: ${JSON.stringify(e)}`,
      },
    };
  }
  const { url: sourceUrl, text, title } = quote;
  const sourceName = title;

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
    ? (await createSourceIfNotExists({ deskId, ...source })).id
    : null;
  const card = await createCard({
    desk,
    text,
    sourceId,
  });
  revalidatePath("/cards");
  redirect(`/cards/${card.id}`);
}

type Quote = { url: string; text: string; title: string };

async function fetchResourceTitle(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  const title = $("title").text();
  return title;
}

async function parseFromQuoteUrlString(
  fromQuoteUrlString: string
): Promise<Quote> {
  const url = new URL(fromQuoteUrlString);
  // https://arc.net/l/quote/xxxxxx
  if (url.hostname === "arc.net") {
    return await parseQuoteFromArcLink(url);
  }
  return parseQuoteFromUrl(url);
}

async function parseQuoteFromArcLink(arcLink: URL): Promise<Quote> {
  const response = await fetch(arcLink.toString(), {
    redirect: "follow",
  });
  const html = await response.text();
  const $ = cheerio.load(html);
  const nextDataJson = $('script[type="application/json"]').text();
  const nextData = JSON.parse(nextDataJson);
  const { url, title, quote } = nextData["props"]["pageProps"]["link"];
  return {
    url,
    title,
    text: quote,
  };
}

async function parseQuoteFromUrl(url: URL): Promise<Quote> {
  const hash = url.hash;
  // drop #:~:text= from hash and urldecode
  const text = decodeURIComponent(hash.slice("#:~:text=".length));
  url.hash = "";
  const urlString = url.toString();
  return {
    url: urlString,
    text,
    title: await fetchResourceTitle(urlString),
  };
}
