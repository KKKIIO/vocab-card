import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import prisma from "lib/prisma";
import Link from "next/link";

export default async function Page() {
  const cards = await prisma.card.findMany({
    orderBy: [{ lastReviewedAt: "asc" }],
    take: 10,
  });

  return (
    <Stack spacing={2}>
      {cards.map((card) => (
        <Card key={card.id}>
          <CardActionArea component={Link} href={`/cards/${card.id}`}>
            <Box sx={{ flex: "column" }}>
              {card.imageUrl ? (
                <CardMedia
                  component={"img"}
                  image={card.imageUrl}
                  sx={{ height: 140 }}
                />
              ) : null}
              <CardContent>
                <Typography variant="body1">{card.text}</Typography>
              </CardContent>
            </Box>
          </CardActionArea>
        </Card>
      ))}
    </Stack>
  );
}
