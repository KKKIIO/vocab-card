import { Delete, QuestionMark } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { requireDefaultDesk } from "app/desks/query";
import { authenticatedUser } from "lib/auth";
import prisma from "lib/prisma";
import Link from "next/link";
import { TextFontTheme } from "../../components/Theme";
import { deleteCard } from "./actions";

export default async function Page() {
  const user = await authenticatedUser();
  const desk = await requireDefaultDesk(user.id);
  const cards = await prisma.card.findMany({
    where: { deskId: desk.id },
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
                      height={300}
                      sx={{
                        width: "50%",
                      }}
                    />
                  ) : null}
                  <CardContent>
                    <ThemeProvider theme={TextFontTheme}>
                      <Typography>{card.text}</Typography>
                    </ThemeProvider>
                  </CardContent>
                </Stack>
              </CardActionArea>
              <Box
                sx={{
                  padding: 1,
                  width: 150,
                }}
              >
                <Stack direction="row">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: "auto",
                      padding: 1,
                    }}
                  >
                    <SourceAvatar source={source} />
                  </Box>
                  <form action={deleteCard}>
                    <input type="hidden" name="id" value={card.id} />
                    <IconButton type="submit">
                      <Delete />
                    </IconButton>
                  </form>
                </Stack>
                {source ? <SourceLink source={source}></SourceLink> : null}
              </Box>
            </Stack>
          </Card>
        );
      })}
    </Stack>
  );
}

function SourceLink({ source }: { source: { name: string; url: string } }) {
  return (
    <MuiLink
      href={source.url}
      variant="body2"
      color="text.secondary"
      sx={{
        textOverflow: "ellipsis",
      }}
    >
      {source.name}
    </MuiLink>
  );
}

function SourceAvatar({ source }: { source: { url: string } | null }) {
  return source ? (
    (() => {
      const hostname = new URL(source.url).hostname;
      return (
        <Avatar
          alt={`${hostname} icon`}
          src={`https://icon.horse/icon/${hostname}?size=small`}
          sx={{
            width: 24,
            height: 24,
          }}
        />
      );
    })()
  ) : (
    <Avatar>
      <QuestionMark />
    </Avatar>
  );
}
