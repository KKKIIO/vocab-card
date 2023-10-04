import prisma from "lib/prisma";
import { Panels } from "./panels";

export default async function Page({ params }: { params: { id: string } }) {
  const card = await prisma.card.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      wordMeaningExamples: {
        include: {
          wordMeaning: {
            select: {
              id: true,
              explanation: true,
              word: {
                select: {
                  id: true,
                  text: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return <Panels card={card}></Panels>;
}
