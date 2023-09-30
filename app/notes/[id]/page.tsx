import prisma from "lib/prisma";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Stack,
} from "@mui/material";
import NoteText from "./text";
import { Word } from "./word";
import { Panels } from "./panels";

export default async function Page({ params }: { params: { id: string } }) {
  const note = await prisma.note.findUnique({
    where: {
      id: Number(params.id),
    },
  });

  return <Panels note={note}></Panels>;
}
