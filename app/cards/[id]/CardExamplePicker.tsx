"use client";
import { Add } from "@mui/icons-material";
import { Alert, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import { CardId } from "app/api/cards/core";
import { MyCardHeader } from "components/MyCardHeader";
import { SubmitButton } from "components/SubmitButton";
import { ClientThemeProvider, TextFontTheme } from "components/Theme";
import { DefaultResponse, GetApiError } from "lib/response";
import { useFormState } from "react-dom";
import { createExample } from "./actions";

export function CardExamplePicker({
  card,
  exampleList,
}: {
  card,
  exampleList
}) {
  const text = card.text;
  const { range, ref } = useTextSelection<HTMLDivElement>();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Card>
          <MyCardHeader card={card} redirectOnSuccess={"/cards"} />
          <CardContent>
            <ClientThemeProvider theme={TextFontTheme}>
              <Typography ref={ref}>{text}</Typography>
            </ClientThemeProvider>
          </CardContent>
          {card.imageUrl ? (
            <CardMedia
              component={"img"}
              image={card.imageUrl}
            />
          ) : null}
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader
            title="Examples"
          />
          <ExamplePicker cardId={card.id} cardText={text} range={range} />
          {exampleList}
        </Card >
      </Grid>
    </Grid>
  );
}

export function ExamplePicker({
  cardId,
  cardText,
  range,
}: {
  cardId: CardId;
  cardText: string;
  range: FilledRange | null;
}) {
  const [state, action] = useFormState(createExample, DefaultResponse());
  const errorMsg = GetApiError(state)?.message;
  const { startOffset, endOffset } = range || { startOffset: 0, endOffset: 0 };
  const selectedText = cardText.slice(startOffset, endOffset);
  // trim whitespace and adjust offsets
  const cardTextStart = startOffset + (
    selectedText.length - selectedText.trimStart().length
  );
  const cardTextEnd = endOffset - (
    selectedText.length - selectedText.trimEnd().length
  )
  const exampleText = selectedText.trim();
  return (
    <form action={action}>
      <CardContent>
        <input type="hidden" name="cardId" value={cardId} />
        <input type="hidden" name="cardTextStart" value={cardTextStart} />
        <input type="hidden" name="cardTextEnd" value={cardTextEnd} />
        <TextField
          value={exampleText}
          name="text"
          InputProps={{ readOnly: true, }}
          variant="standard"
          fullWidth
        />
        {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}
      </CardContent>
      <CardActions>
        <SubmitButton
          loadingPosition="start"
          startIcon={<Add />}
          variant="contained"
          disabled={!exampleText}
        >
          Add Example
        </SubmitButton>
      </CardActions>
    </form>
  )
}

function useTextSelection<T extends Node>() {
  // we need a reference to the element wrapping the text in order to determine
  // if the selection is the selection we are after
  const ref = useRef<T>(null);

  // we store info about the current Range here
  const [range, setRange] = useState<FilledRange | null>(null);

  // In this effect we're registering for the documents "selectionchange" event
  useEffect(() => {
    function handleChange() {
      // get selection information from the browser
      const selection = window.getSelection();

      // we only want to proceed when we have a valid selection
      if (
        !selection ||
        selection.isCollapsed ||
        !ref.current ||
        // and the selection is in the ref.current element
        !ref.current.contains(selection.anchorNode) ||
        !ref.current.contains(selection.focusNode)
      ) {
        setRange(null);
        return;
      }

      const range = selection.getRangeAt(0)
      setRange({
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset,
      });
    }

    document.addEventListener("selectionchange", handleChange);
    return () => document.removeEventListener("selectionchange", handleChange);
  }, []);

  return { range, ref };
}

interface FilledRange {
  startContainer: Node;
  startOffset: number;
  endContainer: Node;
  endOffset: number;
}
