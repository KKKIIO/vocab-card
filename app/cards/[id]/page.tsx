import prisma from "lib/prisma";
import { notFound } from "next/navigation";

import { AddComment, MoreVert } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Stack,
} from "@mui/material";
import { AnnotatedCardText } from "components/AnnotatedCardText";
import { SourceAvatar } from "components/SourceAvatar";
import dayjs from "dayjs";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
  const card = await prisma.card.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      source: true,
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
      <Stack direction="row" justifyContent="space-between">
        {card.imageUrl ? (
          <CardMedia
            component={"img"}
            image={card.imageUrl}
            title="card image"
            sx={{
              maxWidth: "50%",
            }}
          />
        ) : null}
        <Stack direction="column" flexGrow={1}>
          <CardHeader
            avatar={<SourceAvatar source={card.source} />}
            action={
              <IconButton aria-label="settings">
                <MoreVert />
              </IconButton>
            }
            title={card.source?.name ?? ""}
            subheader={dayjs(card.createdAt).format("YYYY/MM/DD")}
          />
          <CardContent>
            <AnnotatedCardText
              text={card.text}
              wordMeaningExamples={card.wordMeaningExamples}
            />
          </CardContent>
        </Stack>
      </Stack>
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
