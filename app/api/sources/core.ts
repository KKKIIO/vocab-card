import prisma from "lib/prisma";


export type CreateSourceArgs = {
  deskId: number;
  name: string; url: string;
}

const nonLocationParams = ["utm_source", "utm_medium", "utm_term"];

export async function upsertSource({
  deskId,
  name, url,
}: CreateSourceArgs) {
  const urlObject = new URL(url);
  if (nonLocationParams.some((param) => urlObject.searchParams.has(param))) {
    for (const param of nonLocationParams) {
      urlObject.searchParams.delete(param);
    }
    url = urlObject.toString();
  }

  return await prisma.source.upsert({
    where: { deskId_url: { deskId, url: url } },
    update: {},
    create: {
      deskId,
      name,
      url,
    },
  })
}