"use client";
import { Delete } from "@mui/icons-material";
import { Alert, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import dayjs from "lib/dayjs";
import { GetApiError, MutResponse } from "lib/response";
import { useFormState } from "react-dom";
import { deleteExample } from "./actions";

type WordMeaningExampleProps = {
  id: number;
  text: string;
  createdAtMilliTs: number;
};

export function ExampleList({
  wordMeaningExamples,
}: {
  wordMeaningExamples: WordMeaningExampleProps[];
}) {
  const [state, action] = useFormState(deleteExample, MutResponse());
  const errorMsg = GetApiError(state)?.message;
  return (
    <>
      <List>
        {wordMeaningExamples.map((example) => (
          <form action={action} key={example.id}>
            <input type="hidden" name="id" value={example.id} />
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  type="submit"
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText
                primary={example.text}
                secondary={
                  <Typography variant="body2" color="text.secondary" suppressHydrationWarning >
                    {dayjs(example.createdAtMilliTs).format("YYYY/MM/DD")}
                  </Typography>
                }
                sx={{ minWidth: 400 }}
              />
            </ListItem>
          </form>
        ))}
      </List>
      {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}
    </>
  );
}
