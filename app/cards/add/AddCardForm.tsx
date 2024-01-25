"use client";
import { Add } from "@mui/icons-material";
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
import { DefaultResponse, GetApiError } from "lib/response";
import { useFormState } from "react-dom";
import { createCard } from "./actions";

export function AddCardForm() {
  const [state, action] = useFormState(createCard, DefaultResponse());
  const errorMsg = GetApiError(state)?.message;
  return (
    <form action={action}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add Card
          </Typography>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            <Grid item xs={12}>
              <TextField name="sourceName" label="Source Name" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField name="sourceUrl" label="Source URL" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="text"
                label="Text"
                multiline
                fullWidth
                minRows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField name="imageUrl" label="Image URL" fullWidth />
            </Grid>
            {errorMsg ? (
              <Grid item xs={12}>
                <Alert severity="error">{errorMsg}</Alert>
              </Grid>
            ) : null}
          </Grid>
        </CardContent>
        <CardActions>
          <SubmitButton startIcon={<Add />}>Add</SubmitButton>
        </CardActions>
      </Card>
    </form>
  );
}
