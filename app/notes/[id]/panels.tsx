"use client";
import {
  Stack,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import NoteText from "./text";
import { Word } from "./word";
import { useState } from "react";

type NoteProps = {
  id: number;
  text: string;
  pictureUrl: string | null;
};

export function Panels({ note }: { note: NoteProps }) {
  const [lastInterest, setLastInterest] = useState({
    text: "",
    open: false,
  });
  const handleClickWord = (word: string) => {
    setLastInterest({ text: word, open: true });
  };
  const handleCloseWordPanel = () => {
    setLastInterest({ ...lastInterest, open: false }); // keep track of the last word because close animation need time to perform
  };
  return (
    <>
      <Stack direction="row">
        <Card>
          {note.pictureUrl ? (
            <CardMedia
              component={"img"}
              image={note.pictureUrl}
              sx={{ height: 140 }}
            />
          ) : null}
          <CardContent>
            <NoteText text={note.text} onClick={handleClickWord} />
          </CardContent>
          <CardActions disableSpacing></CardActions>
        </Card>
        {lastInterest.open ? (
          <Word text={lastInterest.text} onClose={handleCloseWordPanel}></Word>
        ) : null}
      </Stack>
    </>
  );
}
