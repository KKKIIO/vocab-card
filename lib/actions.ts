"use server";
import { requireDefaultDesk } from "app/desks/query";
import { authenticatedUser } from "lib/auth";
import prisma from "lib/prisma";
import { MakeValidateError } from "lib/response";
import { revalidatePath } from "next/cache";
import { zfd } from "zod-form-data";
const deleteCardSchema = zfd.formData({
  id: zfd.numeric(),
});
export async function deleteCard(formData: FormData) {
  const parsed = deleteCardSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: MakeValidateError(parsed.error) };
  }
  const { id } = parsed.data;
  const userId = (await authenticatedUser()).id;
  const desk = await requireDefaultDesk(userId);
  await prisma.card.delete({
    where: {
      id,
      deskId: desk.id,
    },
  });
  revalidatePath("/cards");
}
