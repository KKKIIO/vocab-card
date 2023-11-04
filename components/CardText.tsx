import { Typography } from "@mui/material";
import { ClientThemeProvider, TextFontTheme } from "components/Theme";

export type WordMeaningExampleProps = {
  id: number;
  text: string;
  cardTextStart: number;
  cardTextEnd: number;
  createdAt: Date;
};

function splitByExamples(
  text: string,
  examples: WordMeaningExampleProps[]
): { start: number; end: number; isExample: boolean }[] {
  const result: { start: number; end: number; isExample: boolean }[] = [];
  let i = 0;
  for (const example of examples) {
    result.push({ start: i, end: example.cardTextStart, isExample: false });
    result.push({
      start: example.cardTextStart,
      end: example.cardTextEnd,
      isExample: true,
    });
    i = example.cardTextEnd;
  }
  result.push({ start: i, end: text.length, isExample: false });
  return result;
}

export function CardText({
  text,
  wordMeaningExamples,
}: {
  text: string;
  wordMeaningExamples: WordMeaningExampleProps[];
}) {
  return (
    <ClientThemeProvider theme={TextFontTheme}>
      {splitByExamples(text, wordMeaningExamples).map(
        ({ start, end, isExample }) => {
          const t = text.slice(start, end);
          if (!isExample) {
            return (
              <Typography variant="body1" component="span" key={start}>
                {t}
              </Typography>
            );
          }
          return (
            <Typography
              variant="body1"
              sx={{
                cursor: "pointer",
                textDecoration: "underline",
              }}
              component="span"
              key={start}
            >
              {t}
            </Typography>
          );
        }
      )}
    </ClientThemeProvider>
  );
}
