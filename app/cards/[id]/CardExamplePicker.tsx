"use client";
import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, CardActions, CardContent, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import { ClientThemeProvider, TextFontTheme } from "components/Theme";
import { DefaultResponse, GetApiError } from "lib/response";
import { useFormState, useFormStatus } from "react-dom";
import { createExample } from "./actions";

export function CardExamplePicker({
  cardId,
  text,
}: {
  cardId: number;
  text: string;
}) {
  const { range, ref } = useTextSelection<HTMLDivElement>();
  const [state, action] = useFormState(createExample, DefaultResponse());
  const { pending } = useFormStatus();
  const errorMsg = GetApiError(state)?.message;
  const { startOffset, endOffset } = range || { startOffset: 0, endOffset: 0 };
  return (
    <form action={action}>
      <CardContent>
        <ClientThemeProvider theme={TextFontTheme}>
          <Typography ref={ref}>{text}</Typography>
        </ClientThemeProvider>
        <input type="hidden" name="cardId" value={cardId} />
        <input type="hidden" name="cardTextStart" value={startOffset} />
        <input type="hidden" name="cardTextEnd" value={endOffset} />
        <input
          type="hidden"
          name="text"
          value={text.slice(startOffset, endOffset)}
        />
        {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}
      </CardContent>
      <CardActions>
        <LoadingButton
          startIcon={<Add />}
          variant="contained"
          disabled={!range}
          loading={pending}
          type="submit"
        >
          Add Example
        </LoadingButton>
      </CardActions>
    </form>
  );
}
function useTextSelection<T extends Node>() {
  // we need a reference to the element wrapping the text in order to determine
  // if the selection is the selection we are after
  const ref = useRef<T>(null);

  // we store info about the current Range here
  const [range, setRange] = useState<Range | null>(null);

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

      setRange(selection.getRangeAt(0));
    }

    document.addEventListener("selectionchange", handleChange);
    return () => document.removeEventListener("selectionchange", handleChange);
  }, []);

  return { range, ref };
}
