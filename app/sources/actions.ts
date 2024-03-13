"use server";
import prisma from "lib/prisma";
import { revalidatePath } from "next/cache";
import { zfd } from "zod-form-data";

const deleteSourceSchema = zfd.formData({
  id: zfd.numeric(),
});

export async function deleteSource(formData: FormData) {
  const { id } = deleteSourceSchema.parse(formData);
  await prisma.source.delete({
    where: { id },
  });
  revalidatePath(`/sources`);
}
