import prisma from "../../../lib/prisma";
import { Card, CardActions, CardContent, CardMedia } from "@mui/material";
import WordHighlighter from "./WordHighlighter";

export default async function Page({ params }: { params: { id: string } }) {
  const note = await prisma.note.findUnique({
    where: {
      id: Number(params.id),
    },
  });

  return (
    <Card>
      {note.pictureUrl ? (
        <CardMedia
          component={"img"}
          image={note.pictureUrl}
          sx={{ height: 140 }}
        />
      ) : null}
      <CardContent>
        <WordHighlighter note={note} />
      </CardContent>
      <CardActions disableSpacing></CardActions>
    </Card>
  );
}
