"use client";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { CardText, WordMeaningExampleProps } from "./CardText";
import { Word } from "./word";

type CardProps = {
  id: number;
  text: string;
  imageUrl: string | null;
  wordMeaningExamples: WordMeaningExampleProps[];
};

export function Panels({ card }: { card: CardProps }) {
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
  const meaningId = lastInterest.text
    ? card.wordMeaningExamples.find(
        (wordMeaningExample) =>
          wordMeaningExample.wordMeaning.word.text === lastInterest.text
      )?.wordMeaning?.id ?? null
    : null;
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Card sx={{ height: "fit-content" }}>
          {card.imageUrl ? (
            <CardMedia
              component={"img"}
              image={card.imageUrl}
              sx={{ height: 140 }}
            />
          ) : null}
          <CardContent>
            <CardText
              text={card.text}
              wordMeaningExamples={card.wordMeaningExamples}
              onClick={handleClickWord}
            />
          </CardContent>
          <CardActions disableSpacing></CardActions>
        </Card>
        {lastInterest.open ? (
          <Word
            text={lastInterest.text}
            cardId={card.id}
            meaningId={meaningId}
            onClose={handleCloseWordPanel}
          ></Word>
        ) : null}
      </Stack>
    </>
  );
}
