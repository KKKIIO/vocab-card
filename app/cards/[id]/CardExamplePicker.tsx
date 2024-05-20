"use client";
import { Add, Edit, QuestionAnswer } from "@mui/icons-material";
import { Alert, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";

import { CardId } from "app/api/cards/core";
import { CardActionsMenu } from "components/CardActionsMenu";
import { CopyCardJsonMenuItem } from "components/CopyCardJsonMenuItem";
import { DeleteCardMenuItem } from "components/DeleteCardMenuItem";
import { MyCardHeader } from "components/MyCardHeader";
import { SubmitButton } from "components/SubmitButton";
import { ClientThemeProvider, TextFontTheme } from "components/Theme";
import { GetApiError, MutResponse } from "lib/response";
import Link from "next/link";
import { useFormState } from "react-dom";
import { FilledRange, useTextSelection } from "../../../components/useTextSelection";
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
          <MyCardHeader card={card} action={
            <Stack direction="row">
              <IconButton
                component={Link}
                href={`/cards/${card.id}/ask`}
              >
                <QuestionAnswer />
              </IconButton>
              <IconButton
                component={Link}
                href={`/cards/${card.id}/edit`}
              >
                <Edit />
              </IconButton>
              <CardActionsMenu>
                <DeleteCardMenuItem cardId={card.id} redirectOnSuccess={"/cards"} />
                <CopyCardJsonMenuItem card={card} />
              </CardActionsMenu>
            </Stack>
          } />
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
  const [state, action] = useFormState(createExample, MutResponse());
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


