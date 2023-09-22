"use client";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import { useState } from "react";
import { NoteProps } from "./Note";

function splitByWords(text: string): { start: number, end: number, isWord: boolean }[] {
    const wordRegexp = /\w+/g
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

function CreateWordDialog({ word, open, onClose, onAccept }: { word: string, open: boolean, onClose: () => void, onAccept: () => void }) {
    return (
        <Dialog open={open} onClose={onClose} >
            <DialogTitle id="alert-dialog-title">
                {`"${word}" is not in the dictionary`}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {`The word "${word}" is not in the dictionary. Would you like to add it?`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>No</Button>
                <Button onClick={onAccept} autoFocus>Yes</Button>
            </DialogActions>
        </Dialog>
    );
}

export default function WordHighlighter({ note }: { note: NoteProps }) {
    const [lastInterest, setLastInterest] = useState({ word: '', open: false }); // keep track of the last word because close dialog need time to perform animation
    const handleClickOpen = (word: string) => {
        setLastInterest({ word, open: true });
    };
    const handleClose = () => {
        console.log("close");
        setLastInterest({ ...lastInterest, open: false });
    };
    console.log(`lastInterest: ${JSON.stringify(lastInterest)}`)
    return (
        <div>
            <div>
                {splitByWords(note.text).map(({ start, end, isWord }) => {
                    const t = note.text.slice(start, end);
                    if (!isWord) {
                        return <Typography variant="body1" component="span" key={start}>{t}</Typography>
                    }
                    return (
                        <Typography variant="body1" sx={{
                            textDecoration: "underline",
                            "&:hover": {
                                backgroundColor: "yellow"
                            }
                        }} component="span" onClick={() => handleClickOpen(t)} key={start}>
                            {t}
                        </Typography>
                    );
                })}
            </div>
            {/* TODO: query word from dictionary */}
            <CreateWordDialog word={lastInterest.word} open={lastInterest.open} onClose={handleClose} onAccept={
                () => {
                    // TODO: Add word to dictionary
                    console.log("Add word to dictionary");
                    handleClose();
                }
            }></CreateWordDialog>
        </div>
    )
} 
