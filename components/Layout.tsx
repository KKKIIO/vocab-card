import { ReactNode } from "react";
import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

export default function Layout({ children, title }: { children: ReactNode, title: string }) {
  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <LightbulbIcon></LightbulbIcon>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </AppBar>
      {children}
    </Container>
  );
}
