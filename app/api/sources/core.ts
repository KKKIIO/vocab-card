import prisma from "lib/prisma";


export type CreateSourceArgs = {
  deskId: number;
  name: string;
  url: string;
}

const nonLocationParams = ["utm_source", "utm_medium", "utm_term"];

export async function createSource({
  deskId,
  name, url,
}: CreateSourceArgs) {
  url = cleanUpUrl(url);

  return await prisma.source.create({
    data: {
      deskId,
      name,
      url,
    },
  })
}

export async function createSourceIfNotExists({ deskId, name, url, }: CreateSourceArgs) {
  url = cleanUpUrl(url);

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

function cleanUpUrl(url: string) {
  const urlObject = new URL(url);
  if (nonLocationParams.some((param) => urlObject.searchParams.has(param))) {
    for (const param of nonLocationParams) {
      urlObject.searchParams.delete(param);
    }
    url = urlObject.toString();
  }
  return url;
}
