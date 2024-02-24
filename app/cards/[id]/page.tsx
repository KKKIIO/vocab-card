import prisma from "lib/prisma";
import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  MenuItem
} from "@mui/material";
import { CardActionsMenu } from "components/CardActionsMenu";
import { DeleteCardMenuItem } from "components/DeleteCardMenuItem";
import { SourceAvatar } from "components/SourceAvatar";
import dayjs from "lib/dayjs";
import Link from "next/link";
import { CardExamplePicker } from "./CardExamplePicker";
import { ExampleList } from "./ExampleList";
import { SpeechButton } from "./SpeechButton";

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
          <CardHeader
            avatar={<SourceAvatar source={card.source} />}
            action={
              <>
                <SpeechButton text={card.text} />
                <CardActionsMenu>
                  <MenuItem
                    key={"edit"}
                    component={Link}
                    href={`/cards/${card.id}/edit`}
                  >
                    Edit
                  </MenuItem>
                  <DeleteCardMenuItem cardId={card.id} />
                </CardActionsMenu>
              </>
            }
            title={card.source?.name ?? ""}
            subheader={dayjs(card.createdAt).format("YYYY/MM/DD")}
          />
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
