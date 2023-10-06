"use client";
import {
  Add as AddIcon,
  Close as CloseIcon,
  PlaylistAdd as PlaylistAddIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  // @ts-ignore
  experimental_useFormState as useFormState,
  experimental_useFormStatus as useFormStatus,
} from "react-dom";
import useSWR, { Fetcher } from "swr";
import useSWRMutation from "swr/mutation";
import { WordMeaningProps, WordMeanings } from "./WordMeanings";
import { setWordMeaningExample } from "./actions";

export type WordProps = {
  id: number;
  text: string;
  wordMeanings: WordMeaningProps[];
};

function sendRequest(url: string, { arg }: { arg: any }) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

const wordFetcher: Fetcher<WordProps | null, string> = (url: string) => {
  return fetch(url)
    .then((res) => res.json())
    .then((res) => res.data);
};

export function Word({
  text,
  cardId,
  meaningId,
  onClose,
}: {
  text: string;
  cardId: number;
  meaningId: number | null;
  onClose: () => void;
}) {
  const {
    data: word,
    error,
    isLoading,
    mutate,
  } = useSWR(`/api/words?text=${text}`, wordFetcher);
  const { trigger, isMutating } = useSWRMutation(`/api/words`, sendRequest);
  const [open, setOpen] = useState(false);
  const [explanation, setExplanation] = useState("");
  const { trigger: addMeaning, isMutating: isAddingMeaning } = useSWRMutation(
    () => (word ? `/api/words/${word.id}/meanings` : null),
    sendRequest
  );
  const [state, setExampleAction] = useFormState(setWordMeaningExample, {
    error: null,
  });
  const { pending: setExamplePending } = useFormStatus();
  function handleClose() {
    setOpen(false);
    setExplanation("");
  }
  return (
    <>
      <Card
        sx={{
          width: 350,
        }}
        component="form"
        action={setExampleAction}
      >
        <CardHeader
          title={text}
          titleTypographyProps={{
            sx: {
              textTransform: "capitalize",
            },
          }}
          action={
            <>
              {!isLoading && !error && word ? (
                <IconButton
                  aria-label="add meaning"
                  onClick={() => setOpen(true)}
                >
                  <PlaylistAddIcon />
                </IconButton>
              ) : null}
              <IconButton aria-label="close" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </>
          }
        />
        <Divider />
        <CardContent
          sx={{
            minHeight: 200,
          }}
        >
          {isLoading ? (
            <Skeleton variant="rectangular" width={210} height={60} />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : word ? (
            <>
              <input type="hidden" name="cardId" value={cardId} />
              <input type="hidden" name="wordId" value={word.id} />
              <WordMeanings
                wordMeanings={word.wordMeanings}
                previousId={meaningId}
              />
            </>
          ) : (
            <Alert severity="info">
              <Typography variant="body1">
                This word is not in the dictionary.
              </Typography>
              <Typography variant="body1">Would you like to add it?</Typography>
            </Alert>
          )}
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            flexDirection: "column", // FIXME: we want to align the button to the right using "row" but it only works with "column"
            alignItems: "flex-end",
          }}
        >
          {isLoading || error ? null : word ? (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              aria-disabled={setExamplePending}
              type="submit"
            >
              Save
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              aria-disabled={isMutating}
              onClick={() =>
                trigger({
                  text,
                }).then(() => {
                  mutate();
                })
              }
            >
              Add
            </Button>
          )}
        </CardActions>
      </Card>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Meaning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a new meaning for the word <strong>{text}</strong>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="explanation"
            type="text"
            fullWidth
            multiline
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            aria-disabled={isAddingMeaning}
            onClick={() =>
              addMeaning({
                explanation,
              }).then(() => {
                handleClose();
                mutate();
              })
            }
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
