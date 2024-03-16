"use server";
import { createSource, } from "app/api/sources/core";
import { requireDefaultDesk } from "app/desks/query";
import { authenticatedUser } from "lib/auth";
import { MakeValidateError, Response } from "lib/response";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { zfd } from "zod-form-data";

const createSourceSchema = zfd.formData({
  name: zfd.text(z.string()),
  url: zfd.text(z.string().url()),
});

export async function createSourceAction(
  _: Response,
  formData: FormData
): Promise<Response> {
  const parsed = createSourceSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: MakeValidateError(parsed.error) };
  }
  const { name, url } = parsed.data;
  const userId = (await authenticatedUser()).id;
  const desk = await requireDefaultDesk(userId);

  const deskId = desk.id;
  const source = await createSource({ deskId, name, url });
  revalidatePath("/sources");
  // TODO: add source detail page
  // redirect(`/sources/${source.id}`);
  redirect(`/sources`);
}
