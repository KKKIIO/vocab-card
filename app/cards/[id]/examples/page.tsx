import prisma from "lib/prisma";
import { notFound } from "next/navigation";

import { Card, CardContent, Stack } from "@mui/material";
import { CardImage } from "components/CardImage";
import { CardExamplePicker } from "./CardExamplePicker";
import { ExampleList } from "./ExampleList";

export default async function Page({ params }: { params: { id: string } }) {
  const card = await prisma.card.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      wordMeaningExamples: true,
    },
  });
  if (!card) {
    return notFound();
  }

  return (
    <Stack direction="row" spacing={2}>
      <Card>
        {card.imageUrl ? <CardImage imageUrl={card.imageUrl} /> : null}
        <CardExamplePicker
          cardId={card.id}
          text={card.text}
        ></CardExamplePicker>
      </Card>
      <Card>
        <CardContent>
          <ExampleList wordMeaningExamples={card.wordMeaningExamples} />
        </CardContent>
      </Card>
    </Stack>
  );
}
