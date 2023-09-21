"use client";
import { Card, CardActions, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import WordHighlighter from "./WordHighlighter";
import QuizIcon from '@mui/icons-material/Quiz';

export type NoteProps = {
    id: number;
    text: string;
    pictureUrl: string | null;
}
export default function Note({ note }: { note: NoteProps }) {
    const [highlightWordMode, setHighlightWordMode] = useState(false);
    return (
        <Card>
            {(note.pictureUrl ? <CardMedia component={"img"} image={note.pictureUrl} sx={{ height: 140 }} /> : null)}
            <CardContent>
                {(highlightWordMode ?
                    WordHighlighter(note)
                    : <Typography variant="body1">{note.text}</Typography>)}
            </CardContent>
            <CardActions disableSpacing>
                <IconButton onClick={() => setHighlightWordMode(!highlightWordMode)}>
                    <QuizIcon />
                </IconButton>
            </CardActions>
        </Card >
    )
}

