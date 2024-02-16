"use client";
import { Delete } from "@mui/icons-material";
import { Alert, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { DefaultResponse, GetApiError } from "lib/response";
import { useFormState, useFormStatus } from "react-dom";
import { deleteExample } from "./actions";

type WordMeaningExampleProps = {
  id: number;
  text: string;
  createDate: string;
};

export function ExampleList({
  wordMeaningExamples,
}: {
  wordMeaningExamples: WordMeaningExampleProps[];
}) {
  const { pending } = useFormStatus();
  const [state, action] = useFormState(deleteExample, DefaultResponse());
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
                  aria-disabled={pending}
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText
                primary={example.text}
                secondary={example.createDate}
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
