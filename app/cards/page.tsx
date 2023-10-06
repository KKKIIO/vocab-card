import { Delete } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import prisma from "lib/prisma";
import Link from "next/link";

export default async function Page() {
  const cards = await prisma.card.findMany({
    include: {
      source: true,
    },
    orderBy: [{ createdAt: "desc" }],
    take: 10,
  });

  return (
    <Stack spacing={2}>
      {cards.map((card) => {
        const source = card.source;
        return (
          <Card key={card.id}>
            <Stack direction="row">
              <CardActionArea component={Link} href={`/cards/${card.id}`}>
                <Stack direction="row">
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
                </Stack>
              </CardActionArea>
              <Box
                sx={{
                  padding: 1,
                  width: 150,
                }}
              >
                <Stack direction="row" justifyContent="flex-end">
                  <IconButton>
                    <Delete />
                  </IconButton>
                </Stack>
                {source ? <Source source={source}></Source> : null}
              </Box>
            </Stack>
          </Card>
        );
      })}
    </Stack>
  );
}

function Source({ source }: { source: { name: string; url: string } }) {
  const hostname = new URL(source.url).hostname;
  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <Avatar
        alt={`${hostname} icon`}
        src={`https://icon.horse/icon/${hostname}?size=small`}
        sx={{
          width: 24,
          height: 24,
        }}
      />
      <Typography variant="body2" color="text.secondary">
        <Link href={source.url}>{source.name}</Link>
      </Typography>
    </Stack>
  );
}
