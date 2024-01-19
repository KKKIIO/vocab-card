import { Style } from "@mui/icons-material";
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  MenuItem,
  Link as MuiLink,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { requireDefaultDesk } from "app/desks/query";
import { CardMenuActions } from "components/CardMenuActions";
import { DeleteCardMenuItem } from "components/DeleteCardMenuItem";
import { SourceAvatar } from "components/SourceAvatar";
import { TextFontTheme } from "components/Theme";
import dayjs from "dayjs";
import { authenticatedUser } from "lib/auth";
import prisma from "lib/prisma";
import Link from "next/link";
import { CardsPagination } from "./CardsPagination";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const user = await authenticatedUser();
  const desk = await requireDefaultDesk(user.id);
  const pageSize = 5;
  const cardCount = await prisma.card.count({
    where: { deskId: desk.id },
  });
  let page = 1;
  if (searchParams?.page) {
    const requestPage = Number.parseInt(searchParams.page, 10);
    if (requestPage > 0) {
      page = requestPage;
    }
  }
  const cards = await prisma.card.findMany({
    where: { deskId: desk.id },
    include: {
      source: true,
    },
    orderBy: [{ createdAt: "desc" }],
    take: pageSize,
    skip: (page - 1) * pageSize,
  });
  const pageCount = Math.ceil(cardCount / pageSize);

  return (
    <>
      <Stack spacing={2}>
        {cards.map((card) => {
          return (
            <Card key={card.id}>
              <CardHeader
                avatar={<SourceAvatar source={card.source} />}
                action={
                  <CardMenuActions>
                    <MenuItem
                      key={"edit"}
                      component={Link}
                      href={`/cards/${card.id}/edit`}
                    >
                      Edit
                    </MenuItem>
                    <DeleteCardMenuItem cardId={card.id} />
                  </CardMenuActions>
                }
                title={
                  card.source ? (
                    <SourceLink source={card.source}></SourceLink>
                  ) : null
                }
                subheader={dayjs(card.createdAt).format("YYYY/MM/DD")}
              />

              <CardActionArea component={Link} href={`/cards/${card.id}`}>
                <Stack
                  direction={{
                    xs: "column",
                    md: "row",
                  }}
                >
                  {card.imageUrl ? (
                    <CardMedia
                      component={"img"}
                      image={card.imageUrl}
                      height={300}
                      sx={{
                        width: {
                          xs: "100%",
                          md: "50%",
                        },
                      }}
                    />
                  ) : null}
                  <CardContent>
                    <ThemeProvider theme={TextFontTheme}>
                      <Typography
                        sx={{
                          p: 2,
                        }}
                      >
                        {card.text}
                      </Typography>
                    </ThemeProvider>
                  </CardContent>
                </Stack>
              </CardActionArea>
            </Card>
          );
        })}
        <CardsPagination count={pageCount} defaultPage={page} />
      </Stack>
      <SpeedDial
        ariaLabel="Actions"
        sx={{ position: "fixed", bottom: 64, right: 64 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={
            // SpeedDialAction with link
            // see https://stackoverflow.com/questions/60522401/speeddialaction-with-react-router-dom-link#comment111619674_60525523
            <Link
              href="/cards/add"
              style={{
                display: "flex",
              }}
            >
              <Style color="primary" />
            </Link>
          }
          tooltipTitle="Add Card"
        />
      </SpeedDial>
    </>
  );
}

function SourceLink({ source }: { source: { name: string; url: string } }) {
  return (
    <MuiLink
      href={source.url}
      variant="body2"
      color="text.secondary"
      sx={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: "4",
      }}
    >
      {source.name}
    </MuiLink>
  );
}
