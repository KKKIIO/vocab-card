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
import { GetApiError, MutResponse } from "lib/response";
import { useFormState } from "react-dom";
import { createSourceAction } from "./actions";

export function AddSourceForm() {
  const [state, action] = useFormState(createSourceAction, MutResponse());
  const errorMsg = GetApiError(state)?.message;
  return (
    <form action={action}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add Source
          </Typography>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            <Grid item xs={12}>
              <TextField name="name" label="Name" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField name="url" label="URL" fullWidth />
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
