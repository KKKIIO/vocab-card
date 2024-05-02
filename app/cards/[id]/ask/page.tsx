import prisma from "lib/prisma";
import { notFound } from "next/navigation";

import { CardAskColumns } from "./CardAskColumns";

export default async function Page({ params }: { params: { id: string } }) {
  const card = await prisma.card.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      source: true,
    },
  });
  if (!card) {
    return notFound();
  }

  return (
    <CardAskColumns
      card={card}
    ></CardAskColumns>
  );
}
