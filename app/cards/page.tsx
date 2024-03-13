import { Style } from "@mui/icons-material";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { requireDefaultDesk } from "app/desks/query";
import { MyCardHeader } from "components/MyCardHeader";
import { MyPagination } from "components/MyPagination";
import { TextFontTheme } from "components/Theme";
import { authenticatedUser } from "lib/auth";
import prisma from "lib/prisma";
import Link from "next/link";

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
              <MyCardHeader card={card} />
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
        <MyPagination path={"/cards"} count={pageCount} defaultPage={page} />
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

