"use client";

import { Button, MenuItem } from "@mui/material";
import { useContext } from "react";
import { CloseMenuContext } from "./CloseMenuContext";

export function CopyCardJsonMenuItem({
  card,
}: {
  card: {
    id: number;
    text: string;
    imageUrl: string | null;
    source: {
      name: string;
      url: string;
    } | null;
  };
}) {
  const closeMenu = useContext(CloseMenuContext);
  return (
    <MenuItem
      key={"copyjson"}
      component={Button}
      sx={{
        textTransform: "none",
      }}
      onClick={() =>
        navigator.clipboard
          .writeText(JSON.stringify(card, undefined, 2))
          .then(closeMenu)
      }
    >
      Copy JSON
    </MenuItem>
  );
}
