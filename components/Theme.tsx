"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const TextFontTheme = createTheme({
  typography: {
    fontFamily: ["Arvo", "serif"].join(","),
  },
});

export const ClientThemeProvider = ThemeProvider;
