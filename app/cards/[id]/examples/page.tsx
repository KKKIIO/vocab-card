import prisma from "lib/prisma";
import { notFound } from "next/navigation";

import { Box, Card, CardContent, CardMedia, Divider } from "@mui/material";
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
    <Box>
      <Card sx={{ height: "fit-content" }}>
        {card.imageUrl ? (
          <CardMedia
            component={"img"}
            image={card.imageUrl}
            height={300}
            sx={{ objectFit: "contain" }}
          />
        ) : null}
        <CardExamplePicker
          cardId={card.id}
          text={card.text}
        ></CardExamplePicker>
      </Card>
      <Divider />
      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <ExampleList wordMeaningExamples={card.wordMeaningExamples} />
        </CardContent>
      </Card>
    </Box>
  );
}
