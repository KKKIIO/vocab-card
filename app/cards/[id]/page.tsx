import prisma from "lib/prisma";
import { notFound } from "next/navigation";

import { AddComment } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent } from "@mui/material";
import { CardImage } from "components/CardImage";
import { CardText } from "components/CardText";
import Link from "next/link";

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
  await prisma.card.update({
    where: {
      id: card.id,
    },
    data: {
      lastReviewedAt: new Date(),
    },
  });

  return (
    <Card>
      {card.imageUrl ? <CardImage imageUrl={card.imageUrl} /> : null}
      <CardContent>
        <CardText
          text={card.text}
          wordMeaningExamples={card.wordMeaningExamples}
        />
      </CardContent>
      <CardActions>
        <Button
          startIcon={<AddComment />}
          component={Link}
          href={`/cards/${card.id}/examples`}
        >
          Add Word Examples
        </Button>
      </CardActions>
    </Card>
  );
}
