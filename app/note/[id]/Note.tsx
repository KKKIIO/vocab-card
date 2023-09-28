"use client";
import { Card, CardActions, CardContent, CardMedia } from "@mui/material";
import WordHighlighter from "./WordHighlighter";

export type NoteProps = {
    id: number;
    text: string;
    pictureUrl: string | null;
}
export default function Note({ note }: { note: NoteProps }) {
    return (
        <Card>
            {(note.pictureUrl ? <CardMedia component={"img"} image={note.pictureUrl} sx={{ height: 140 }} /> : null)}
            <CardContent>
                <WordHighlighter note={note} />
            </CardContent>
            <CardActions disableSpacing>
            </CardActions>
        </Card >
    )
}

