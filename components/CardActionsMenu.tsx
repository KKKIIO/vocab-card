"use client";
import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu } from "@mui/material";
import { MouseEvent, useState } from "react";
import { CloseMenuContext } from "./CloseMenuContext";

const ITEM_HEIGHT = 48;
export function CardActionsMenu({ children }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <IconButton
        aria-label="more-actions"
        id="more-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "more-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <CloseMenuContext.Provider value={handleClose}>
          {children}
        </CloseMenuContext.Provider>
      </Menu>
    </div>
  );
}
