"use client";
import { Typography } from "@mui/material";

export type WordMeaningExampleProps = {
  id: number;
  wordMeaning: {
    id: number;
    explanation: string;
    word: {
      id: number;
      text: string;
    };
  };
};

function splitByWords(
  text: string
): { start: number; end: number; isWord: boolean }[] {
  const wordRegexp = /\w+/g;
  const matchs = text.matchAll(wordRegexp);
  let lastIndex = 0;
  const result = [];
  for (const match of matchs) {
    const word = match[0];
    const index = match.index;
    if (index > lastIndex) {
      result.push({ start: lastIndex, end: index, isWord: false });
    }
    result.push({ start: index, end: index + word.length, isWord: true });
    lastIndex = index + word.length;
  }
  if (lastIndex < text.length) {
    result.push({ start: lastIndex, end: text.length, isWord: false });
  }
  return result;
}

export function NoteText({
  text,
  wordMeaningExamples,
  onClick,
}: {
  text: string;
  wordMeaningExamples: WordMeaningExampleProps[];
  onClick: (word: string) => void;
}) {
  const words = wordMeaningExamples.reduce((acc, { wordMeaning }) => {
    acc[wordMeaning.word.text] = true;
    return acc;
  }, {} as Record<string, boolean>);
  return (
    <div>
      <div>
        {splitByWords(text).map(({ start, end, isWord }) => {
          const t = text.slice(start, end);
          if (!isWord) {
            return (
              <Typography variant="body1" component="span" key={start}>
                {t}
              </Typography>
            );
          }
          const sx = {
            "&:hover": {
              backgroundColor: "yellow",
            },
            cursor: "pointer",
          };
          if (words[t]) {
            sx["textDecoration"] = "underline";
          }
          return (
            <Typography
              variant="body1"
              sx={sx}
              component="span"
              onClick={() => onClick(t)}
              key={start}
            >
              {t}
            </Typography>
          );
        })}
      </div>
    </div>
  );
}
