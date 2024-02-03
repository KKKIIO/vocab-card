import dayjs from "lib/dayjs";
import prisma from "lib/prisma";
import { notFound } from "next/navigation";

import { Card, CardContent, CardMedia, Stack } from "@mui/material";
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
        {card.imageUrl ? (
          <CardMedia
            component={"img"}
            image={card.imageUrl}
            sx={{
              maxHeight: "70%",
            }}
          />
        ) : null}
        <CardExamplePicker
          cardId={card.id}
          text={card.text}
        ></CardExamplePicker>
      </Card>
      <Card>
        <CardContent>
          <ExampleList
            wordMeaningExamples={card.wordMeaningExamples.map((e) => ({
              id: e.id,
              text: e.text,
              createDate: dayjs(e.createdAt).format("YYYY/MM/DD"),
            }))}
          />
        </CardContent>
      </Card>
    </Stack>
  );
}
