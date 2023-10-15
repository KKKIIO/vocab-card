"use server";
import prisma from "lib/prisma";
import { revalidatePath } from "next/cache";
import { zfd } from "zod-form-data";
export async function deleteCard(formData: FormData) {
  const schema = zfd.formData({
    id: zfd.numeric(),
  });
  const { id } = schema.parse(formData);
  await prisma.card.delete({
    where: {
      id,
    },
  });
  revalidatePath("/cards");
  // TODO: handle error
}
