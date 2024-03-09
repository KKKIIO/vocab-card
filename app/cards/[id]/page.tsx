import prisma from "lib/prisma";
import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid
} from "@mui/material";
import { MyCardHeader } from "components/MyCardHeader";
import dayjs from "lib/dayjs";
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
  await prisma.card.update({
    where: {
      id: card.id,
    },
    data: {
      lastReviewedAt: dayjs().toDate(),
    },
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Card>
          <MyCardHeader card={card} redirectOnSuccess={"/cards"} />
          {card.imageUrl ? (
            <CardMedia
              component={"img"}
              image={card.imageUrl}
              sx={{
                width: {
                  xs: "100%",
                  md: "50%",
                },
              }}
            />
          ) : null}
          <CardExamplePicker
            cardId={card.id}
            text={card.text}
          ></CardExamplePicker>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader
            title="Examples"
          />
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
      </Grid>
    </Grid>
  );
}
