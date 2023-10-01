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
  const notes = await prisma.note.findMany({
    orderBy: [{ lastReviewedAt: "asc" }],
    take: 10,
  });

  return (
    <Stack spacing={2}>
      {notes.map((note) => (
        <Card>
          <CardActionArea component={Link} href={`/notes/${note.id}`}>
            <Box sx={{ flex: "column" }}>
              {note.pictureUrl ? (
                <CardMedia
                  component={"img"}
                  image={note.pictureUrl}
                  sx={{ height: 140 }}
                />
              ) : null}
              <CardContent>
                <Typography variant="body1">{note.text}</Typography>
              </CardContent>
            </Box>
          </CardActionArea>
        </Card>
      ))}
    </Stack>
  );
}
