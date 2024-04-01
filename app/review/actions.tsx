"use server";
import { $Enums } from "@prisma/client";
import dayjs from "lib/dayjs";

import { authenticatedUser } from "lib/auth";
import prisma from "lib/prisma";
import { MakeValidateError } from "lib/response";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { z } from "zod";
import { zfd } from "zod-form-data";

const DifficultyEnum = z.nativeEnum($Enums.Difficulty);

const reviewCardSchema = zfd.formData({
  id: zfd.numeric(),
  difficulty: zfd.text(DifficultyEnum),
});

export async function reviewCardAction(formData: FormData) {
  const parsed = reviewCardSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: MakeValidateError(parsed.error) };
  }
  const { id, difficulty } = parsed.data;
  const userId = (await authenticatedUser()).id;
  const reviewItem = await prisma.reviewItem.findUnique({
    where: {
      id,
      userId,
    },
  });
  if (!reviewItem) {
    return notFound();
  }
  const today = dayjs();
  let reviewIntervalDays = 14;
  if (difficulty === $Enums.Difficulty.TRIVIAL) {
    reviewIntervalDays = 100 * 365; // no need to review for a long time
  }
  await prisma.$transaction([
    prisma.reviewItem.update({
      where: {
        id,
      },
      data: {
        nextReviewDate: today.add(reviewIntervalDays, "day").toDate(),
      },
    }),
    prisma.reviewItemLog.create({
      data: {
        reviewItemId: id,
        difficulty,
      },
    }),
  ]);

  revalidatePath("/review");
}
