"use client";
import { Avatar, Box, IconButton, Menu, MenuItem } from "@mui/material";
import { MouseEvent, useState } from "react";

function avatarLetter(name: string | undefined | null) {
  return name ? name.split(" ")[0][0].toUpperCase() : "";
}

export function UserAvatar({
  user,
}: {
  user: { name?: string | null | undefined; email?: string | null | undefined };
}) {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        <Avatar>{avatarLetter(user.name ?? user.email)}</Avatar>
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {/* TODO: implement function */}
        <MenuItem onClick={handleCloseUserMenu}>Profile</MenuItem>
        <MenuItem onClick={handleCloseUserMenu}>Logout</MenuItem>
      </Menu>
    </Box>
    // <div>
    //   <Tooltip title="Account settings">
    //     <IconButton
    //       size="large"
    //       aria-label="account of current user"
    //       aria-controls="menu-appbar"
    //       aria-haspopup="true"
    //       onClick={handleMenu}
    //       color="inherit"
    //     >
    //       <AccountCircle />
    //     </IconButton>
    //   </Tooltip>
    //   <Menu
    //     id="menu-appbar"
    //     anchorEl={anchorEl}
    //     anchorOrigin={{
    //       vertical: "top",
    //       horizontal: "right",
    //     }}
    //     keepMounted
    //     transformOrigin={{
    //       vertical: "top",
    //       horizontal: "right",
    //     }}
    //     open={Boolean(anchorEl)}
    //     onClose={handleClose}
    //   >
    //   </Menu>
    // </div>
  );
}
