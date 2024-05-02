import prisma from "lib/prisma";
import { notFound } from "next/navigation";

import { CardExamplePicker } from "./CardExamplePicker";
import { ExampleList } from "./ExampleList";

export default async function Page({ params }: { params: { id: string } }) {
  const card = await prisma.card.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      source: true,
      wordMeaningExamples: {
        orderBy: {
          cardTextStart: "asc"
        }
      }
    },
  });
  if (!card) {
    return notFound();
  }

  return (
    <CardExamplePicker
      card={card}
      exampleList={
        <ExampleList
          wordMeaningExamples={card.wordMeaningExamples.map((e) => ({
            id: e.id,
            text: e.text,
            createdAtMilliTs: e.createdAt.valueOf(),
          }))}
        />
      }
    ></CardExamplePicker>
  );
}
