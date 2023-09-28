"use client";
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItemText,
} from "@mui/material";
import logger from "../../../lib/logger";
import { useEffect, useState, useTransition } from "react";

function AddWordDialog({
  wordText,
  open,
  onClose,
  onAdd,
}: {
  wordText: string;
  open: boolean;
  onClose: () => void;
  onAdd: (word: any) => void;
}) {
  const [isTransitionStarted, startTransition] = useTransition();
  function AddToDictionary() {
    startTransition(() => {
      fetch(`/api/words`, {
        method: "POST",
        body: JSON.stringify({ text: wordText }),
      })
        .then((res) => res.json())
        .then((res) => {
          onAdd(res.data);
        })
        .catch((err) => {
          // TODO: handle error
          logger.error(err);
        });
    });
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">
        {"Add word to dictionary"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`The word "${wordText}" is not in the dictionary. Would you like to add it?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button aria-disabled={isTransitionStarted} onClick={AddToDictionary}>
          Yes
        </Button>
        <Button onClick={onClose} autoFocus>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ConnectWordDialog({
  wordText,
  open,
  onClose,
}: {
  wordText: string;
  open: boolean;
  onClose: () => void;
}) {
  const [word, setWord] = useState(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    fetch(`/api/words?text=${wordText}`)
      .then((res) => res.json())
      .then((res) => {
        if (isCancelled) return;
        setWord(res.data);
        setLoading(false);
      })
      .catch((err) => {
        // TODO: handle error
        logger.error(err);
      });
    return () => {
      isCancelled = true;
    };
  }, [wordText]);
  if (isLoading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={onClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  if (!word) {
    return (
      <AddWordDialog
        wordText={wordText}
        open={open}
        onClose={onClose}
        onAdd={setWord}
      ></AddWordDialog>
    );
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">{wordText}</DialogTitle>
      <DialogContent>
        <List>
          {(word?.wordMeanings || []).map((meaning, index) => {
            return (
              <ListItemText key={index}>{meaning.explanation}</ListItemText>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
