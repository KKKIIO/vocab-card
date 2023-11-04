"use client";
import { Delete } from "@mui/icons-material";
import { Alert, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { WordMeaningExampleProps } from "components/CardText";
import dayjs from "dayjs";
import { useFormState, useFormStatus } from "react-dom";
import { DefaultResponse, GetApiError } from "../../../../lib/response";
import { deleteExample } from "./actions";

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
                secondary={dayjs(example.createdAt).format("YYYY/MM/DD")}
              />
            </ListItem>
          </form>
        ))}
      </List>
      {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}
    </>
  );
}
