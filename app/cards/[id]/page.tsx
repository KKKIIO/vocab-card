import prisma from "lib/prisma";
import { notFound } from "next/navigation";

import { AddComment } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  MenuItem,
  Stack,
} from "@mui/material";
import { AnnotatedCardText } from "components/AnnotatedCardText";
import { CardActionsMenu } from "components/CardActionsMenu";
import { DeleteCardMenuItem } from "components/DeleteCardMenuItem";
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
      <CardHeader
        avatar={<SourceAvatar source={card.source} />}
        action={
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
        }
        title={card.source?.name ?? ""}
        subheader={dayjs(card.createdAt).format("YYYY/MM/DD")}
      />
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
      >
        {card.imageUrl ? (
          <CardMedia
            component={"img"}
            image={card.imageUrl}
            title="card image"
            sx={{
              width: {
                xs: "100%",
                md: "50%",
              },
            }}
          />
        ) : null}
        <CardContent>
          <Box sx={{ p: 2 }}>
            <AnnotatedCardText
              text={card.text}
              wordMeaningExamples={card.wordMeaningExamples}
            />
          </Box>
        </CardContent>
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
