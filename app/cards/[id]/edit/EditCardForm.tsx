"use client";
import { Edit } from "@mui/icons-material";
import {
  Alert,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitButton } from "components/SubmitButton";
import { GetApiError, MutResponse } from "lib/response";
import { useFormState } from "react-dom";
import { editCard } from "./actions";

export function EditCardForm({
  card,
}: {
  card: {
    id: number;
    source: {
      name: string;
      url: string;
    } | null;
    text: string;
    imageUrl: string;
  };
}) {
  const [state, action] = useFormState(editCard, MutResponse());
  const errorMsg = GetApiError(state)?.message;
  return (
    <form action={action}>
      <input type="hidden" name="id" value={card.id} />
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Edit Card
          </Typography>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            <Grid item xs={12}>
              <TextField
                name="sourceName"
                label="Source Name"
                defaultValue={card.source?.name}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="sourceUrl"
                label="Source URL"
                defaultValue={card.source?.url}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="text"
                label="Text"
                defaultValue={card.text}
                multiline
                fullWidth
                minRows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="imageUrl"
                label="Image URL"
                defaultValue={card.imageUrl}
                fullWidth
              />
            </Grid>
            {errorMsg ? (
              <Grid item xs={12}>
                <Alert severity="error">{errorMsg}</Alert>
              </Grid>
            ) : null}
          </Grid>
        </CardContent>
        <CardActions>
          <SubmitButton startIcon={<Edit />}>Save</SubmitButton>
        </CardActions>
      </Card>
    </form>
  );
}
