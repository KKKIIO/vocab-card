import { Card, Prisma } from "@prisma/client";
import dayjs from "lib/dayjs";
import prisma from "lib/prisma";

export type CreateCardArgs = {
  desk: {
    id: number;
    userId: string;
  };
  text: string;
  imageUrl: string | undefined;
  sourceId: number | null;
};

export async function createCard({
  desk,
  text,
  imageUrl,
  sourceId,
}: CreateCardArgs) {
  return await prisma.$transaction(async (tx) => {
    const card = await tx.card.create({
      data: {
        deskId: desk.id,
        text,
        imageUrl,
        sourceId,
      },
    });
    await onCardCreated(tx, desk.userId, card);
    return card;
  });
}

async function onCardCreated(
  tx: Prisma.TransactionClient,
  userId: string,
  card: Card
) {
  const today = dayjs();
  // add a review item
  await tx.reviewItem.create({
    data: {
      cardId: card.id,
      userId,
      nextReviewDate: today.toDate(),
    },
  });
}
