"use client";
import { Add } from "@mui/icons-material";
import {
  Alert,
  Box,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField
} from "@mui/material";
import { SubmitButton } from "components/SubmitButton";
import { DefaultResponse, GetApiError } from "lib/response";
import { useState } from "react";
import { useFormState } from "react-dom";
import { createCardAction, createCardFromQuoteUrlAction } from "./actions";

export function AddCardForm() {
  const [state, action] = useFormState(createCardAction, DefaultResponse());
  const [quoteUrlState, quoteUrlAction] = useFormState(createCardFromQuoteUrlAction, DefaultResponse());
  const errorMsg = GetApiError(state)?.message;
  const quoteUrlErrorMsg = GetApiError(quoteUrlState)?.message;

  const [value, setValue] = useState(0);

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="add card forms">
          <Tab label="Add Card" />
          <Tab label="Add Card from Quote URL" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <form action={action}>
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
            <Grid
              item xs={12}
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Grid item>
                <SubmitButton startIcon={<Add />}>Add</SubmitButton>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <form action={quoteUrlAction}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                name="quoteUrl"
                label="Quote URL"
                fullWidth
              />
            </Grid>
            {quoteUrlErrorMsg ? (
              <Grid item xs={12}>
                <Alert severity="error">{quoteUrlErrorMsg}</Alert>
              </Grid>
            ) : null}
            <Grid item xs={12}
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Grid item >
                <SubmitButton startIcon={<Add />}>Add</SubmitButton>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </TabPanel>
    </Paper>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}