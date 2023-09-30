"use client";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import useSWRMutation from "swr/mutation";
import {
  Alert,
  Button,
  Card,
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
  ListItemIcon,
  ListItemText,
  Skeleton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import logger from "lib/logger";
import { useState, useTransition } from "react";
import useSWR, { Fetcher } from "swr";

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

const wordFetcher: Fetcher<WordProps, string> = (url: string) => {
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
  return (
    <>
      <Card>
        <CardHeader
          title={text}
          action={
            <IconButton aria-label="close" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
        />
        <Divider />
        <CardContent>
          {isLoading ? (
            <Skeleton variant="rectangular" width={210} height={60} />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : word ? (
            <WordMeanings word={word} onMutate={() => mutate()} />
          ) : (
            <Button
              aria-disabled={isMutating}
              onClick={() =>
                trigger({
                  text,
                }).then(() => {
                  mutate();
                })
              }
              variant="outlined"
              sx={{
                textTransform: "none",
              }}
            >
              <Typography variant="body1" component="span">
                The word <strong>{text}</strong> is not in the dictionary. Would
                you like to add it?
              </Typography>
            </Button>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function WordMeanings({
  word,
  onMutate,
}: {
  word: WordProps;
  onMutate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [explanation, setExplanation] = useState("");
  const { trigger, isMutating } = useSWRMutation(
    `/api/words/${word.id}/meanings`,
    sendRequest
  );
  function handleClose() {
    setOpen(false);
    setExplanation("");
  }
  return (
    <>
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
        <ListItemButton
          key={word.wordMeanings.length}
          onClick={() => setOpen(true)}
          sx={{
            border: "4px dotted #ccc",
            borderRadius: "4px",
            minHeight: "80px",
          }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText>New Meaning</ListItemText>
        </ListItemButton>
      </List>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add new meaning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a new meaning for the word {word.text}
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
            aria-disabled={isMutating}
            onClick={() =>
              trigger({
                explanation,
              }).then(() => {
                handleClose();
                onMutate();
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

// export function AddWord({
//   wordText,
//   onMutate,
// }: {
//   wordText: string;
//   onMutate: (word: WordProps) => void;
// }) {
//   const [isTransitionStarted, startTransition] = useTransition();
//   function createWord() {
//     startTransition(() => {
//       fetch(`/api/words`, {
//         method: "POST",
//         body: JSON.stringify({ text: wordText }),
//       })
//         .then((res) => res.json())
//         .then((res) => {
//           onMutate(res.data);
//         })
//         .catch((err) => {
//           // TODO: handle error
//           logger.error(err);
//         });
//     });
//   }
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle id="alert-dialog-title">
//         {"Add word to dictionary"}
//       </DialogTitle>
//       <DialogContent>
//         <DialogContentText id="alert-dialog-description">
//           {`The word "${wordText}" is not in the dictionary. Would you like to add it?`}
//         </DialogContentText>
//       </DialogContent>
//       <DialogActions>
//         <Button aria-disabled={isTransitionStarted} onClick={createWord}>
//           Yes
//         </Button>
//         <Button onClick={onClose} autoFocus>
//           No
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
