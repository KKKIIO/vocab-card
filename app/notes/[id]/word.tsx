"use client";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
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
  List,
  ListItemButton,
  ListItemText,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import useSWR, { Fetcher } from "swr";
import useSWRMutation from "swr/mutation";

export type WordProps = {
  id: number;
  text: string;
  wordMeanings: {
    id: number;
    explanation: string;
  }[];
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

export function Word({ text, onClose }: { text: string; onClose: () => void }) {
  const {
    data: word,
    error,
    isLoading,
    mutate,
  } = useSWR(`/api/words?text=${text}`, wordFetcher);
  const { trigger, isMutating } = useSWRMutation(`/api/words`, sendRequest);
  const [open, setOpen] = useState(false);
  const [explanation, setExplanation] = useState("");
  const { trigger: triggerMeanings, isMutating: isMutatingMeanings } =
    useSWRMutation(
      () => (word ? `/api/words/${word.id}/meanings` : null),
      sendRequest
    );
  function handleClose() {
    setOpen(false);
    setExplanation("");
  }
  return (
    <>
      <Card
        sx={{
          minHeight: 400,
          width: 350,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardHeader
          title={text}
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
        <CardContent>
          {isLoading ? (
            <Skeleton variant="rectangular" width={210} height={60} />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : word ? (
            <WordMeanings word={word} />
          ) : (
            <>
              <Typography variant="body1">
                The word <strong>{text}</strong> is not in the dictionary.
              </Typography>
              <Typography variant="body1">Would you like to add it?</Typography>
            </>
          )}
        </CardContent>
        <CardActions
          sx={{
            mt: "auto",
            display: "flex",
            flexDirection: "column", // FIXME: we want to align the button to the right using "row" but it only works with "column"
            alignItems: "flex-end",
          }}
        >
          {!isLoading && !error && !word ? (
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
              ADD
            </Button>
          ) : null}
        </CardActions>
      </Card>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add new meaning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a new meaning for the word {text}
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
            aria-disabled={isMutatingMeanings}
            onClick={() =>
              triggerMeanings({
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

function WordMeanings({ word }: { word: WordProps }) {
  return (
    <List>
      {word.wordMeanings.map((meaning, index) => (
        <ListItemButton
          sx={{
            border: "4px solid #ccc",
            borderRadius: "4px",
            minHeight: "80px",
          }}
        >
          <ListItemText key={index}>{meaning.explanation}</ListItemText>
        </ListItemButton>
      ))}
    </List>
  );
}
