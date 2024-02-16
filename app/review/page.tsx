import {
  Alert,
  AlertTitle,
  Badge,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Link,
  Stack,
  Typography
} from "@mui/material";
import { AnnotatedCardText } from "components/AnnotatedCardText";
import { SourceAvatar } from "components/SourceAvatar";
import { authenticatedUser } from "lib/auth";
import dayjs from "lib/dayjs";
import prisma from "lib/prisma";
import { reviewCardAction } from "./actions";

export default async function Page({ }) {
  const user = await authenticatedUser();
  const today = dayjs();
  const nextReviewItem = await prisma.reviewItem.findFirst({
    where: {
      userId: user.id,
      nextReviewDate: {
        lte: today.toDate(),
      },
    },
    orderBy: [{ nextReviewDate: "asc" }, { createdAt: "asc" }],
    include: {
      card: {
        include: {
          source: true,
          wordMeaningExamples: {
            orderBy: {
              cardTextStart: "asc"
            }
          },
        },
      },
    },
  });
  if (!nextReviewItem) {
    return (
      <Alert severity="success">
        <AlertTitle>☕Take a break!</AlertTitle>
        <Typography variant="body1">
          You're all caught up! Come back tomorrow for more cards to review.
        </Typography>
      </Alert>
    );
  }

  const lastReviewLog = await prisma.reviewItemLog.findFirst({
    where: {
      reviewItemId: nextReviewItem.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const lastReviewDate = lastReviewLog?.createdAt;

  const pendingCount = await prisma.reviewItem.count({
    where: {
      userId: user.id,
      nextReviewDate: {
        lte: today.toDate(),
      },
    },
  });

  const card = nextReviewItem.card;
  return (
    <Card>
      <CardHeader
        avatar={<SourceAvatar source={card.source} />}
        title={card.source?.name ?? ""}
        subheader={
          lastReviewDate
            ? `Last reviewed ${dayjs(lastReviewDate).fromNow()}`
            : `Created ${dayjs(card.createdAt).fromNow()}`
        }
      />
      <CardActionArea component={Link} href={`/cards/${card.id}`}>
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
      </CardActionArea>
      <CardActions>
        <form action={reviewCardAction}>
          <input type="hidden" name="id" value={nextReviewItem.id} />
          <input type="hidden" name="difficulty" value="MEDIUM" />
          <Button type="submit" variant="outlined" color="primary">
            <Badge badgeContent={pendingCount} color="primary">
              Not Sure
            </Badge>
          </Button>
        </form>
        {/* <IconButton aria-label="Mark as trivial">
          <Delete />
        </IconButton> */}
      </CardActions>
    </Card>
  );
}
