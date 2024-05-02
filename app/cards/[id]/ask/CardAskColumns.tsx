"use client";
import { Send } from "@mui/icons-material";
import { Alert, Card, CardContent, CardMedia, Divider, Grid, List, ListItem, ListItemText, Paper, TextField, Typography } from "@mui/material";

import { CardId } from "app/api/cards/core";
import { MyCardHeader } from "components/MyCardHeader";
import { SubmitButton } from "components/SubmitButton";
import { ClientThemeProvider, TextFontTheme } from "components/Theme";
import { FilledRange, useTextSelection } from "components/useTextSelection";
import { GetApiError } from "lib/response";
import { useFormState } from "react-dom";
import { GptMessage, askWordMeaning } from "./actions";


export function CardAskColumns({
  card,
}: {
  card,
}) {
  const text = card.text;
  const { range, ref } = useTextSelection<HTMLDivElement>();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card>
          <MyCardHeader card={card} />
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
      <Grid item xs={12} md={6}>
        <AskPanel cardId={card.id} cardText={text} range={range} />
      </Grid>
    </Grid>
  );
}

export function AskPanel({
  cardId,
  cardText,
  range,
}: {
  cardId: CardId;
  cardText: string;
  range: FilledRange | null;
}) {
  const [state, action] = useFormState(askWordMeaning, { data: [] });
  const errorMsg = GetApiError(state)?.message;
  const { startOffset, endOffset } = range || { startOffset: 0, endOffset: 0 };
  const selectedText = cardText.slice(startOffset, endOffset);
  const exampleText = selectedText.trim();
  let messages: GptMessage[] = [];
  if ("data" in state) {
    messages = state.data
  }

  return (
    <Paper
      sx={{
        padding: 2,
      }}
    >
      <form action={action}>
        <input type="hidden" name="cardId" value={cardId} />
        <TextField
          value={exampleText}
          name="text"
          InputProps={{ readOnly: true, }}
          variant="standard"
          fullWidth
        />
        {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}
        <SubmitButton
          loadingPosition="start"
          startIcon={<Send />}
          variant="contained"
          disabled={!exampleText}
        >
          Ask Word Meanning
        </SubmitButton>
      </form>
      <List>
        {
          messages.map((m, i) => {

            return (
              <>
                {(i > 0 ? <Divider variant="inset" component="li" /> : null)}
                <ListItem key={i}>
                  <ListItemText primary={m.role} secondary={m.content} />
                </ListItem>
              </>
            )
          })
        }
      </List>
    </Paper>
  )
}
