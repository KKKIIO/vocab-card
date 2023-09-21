"use client";
import { Typography } from "@mui/material";
import React from "react";
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

export default function WordHighlighter(note: NoteProps) {
    return splitByWords(note.text).map(({ start, end, isWord }) => {
        const sx = isWord ? {
            textDecoration: "underline",
            "&:hover": {
                backgroundColor: "yellow"
            }
        } : {};
        const t = note.text.slice(start, end);
        return <Typography variant="body1" sx={sx} component="span" key={start}>
            {t}
        </Typography>;
    });
} 
