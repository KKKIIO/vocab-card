"use client";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { NoteText, WordMeaningExampleProps } from "./text";
import { Word } from "./word";

type NoteProps = {
  id: number;
  text: string;
  pictureUrl: string | null;
  wordMeaningExamples: WordMeaningExampleProps[];
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
  let meaningId = null;
  if (lastInterest.text) {
    const wordMeaningExample = note.wordMeaningExamples.find(
      (wordMeaningExample) =>
        wordMeaningExample.wordMeaning.word.text === lastInterest.text
    );
    if (wordMeaningExample) {
      meaningId = wordMeaningExample.wordMeaning.id;
    }
  }
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Card sx={{ height: "fit-content" }}>
          {note.pictureUrl ? (
            <CardMedia
              component={"img"}
              image={note.pictureUrl}
              sx={{ height: 140 }}
            />
          ) : null}
          <CardContent>
            <NoteText
              text={note.text}
              wordMeaningExamples={note.wordMeaningExamples}
              onClick={handleClickWord}
            />
          </CardContent>
          <CardActions disableSpacing></CardActions>
        </Card>
        {lastInterest.open ? (
          <Word
            text={lastInterest.text}
            noteId={note.id}
            meaningId={meaningId}
            onClose={handleCloseWordPanel}
          ></Word>
        ) : null}
      </Stack>
    </>
  );
}
