import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

export function WordMeanings({
  wordMeanings,
  previousId,
}: {
  wordMeanings: WordMeaningProps[];
  previousId: number | null;
}) {
  return (
    <FormControl>
      <FormLabel id="word-meanings-group">Meaning</FormLabel>
      <RadioGroup
        name="meaningId"
        aria-labelledby="word-meanings-group"
        defaultValue={previousId}
        key={previousId}
      >
        {wordMeanings.map((meaning) => (
          <FormControlLabel
            key={meaning.id}
            value={meaning.id}
            control={<Radio />}
            label={meaning.explanation}
            color={meaning.id === previousId ? "secondary" : "primary"}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
export type WordMeaningProps = {
  id: number;
  explanation: string;
};
