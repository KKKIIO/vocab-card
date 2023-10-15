import { Home, Style } from "@mui/icons-material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportIcon from "@mui/icons-material/Support";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { UserAvatar } from "components/UserAvatar";
import { authenticatedUser } from "lib/auth";
import Link from "next/link";
const DRAWER_WIDTH = 240;

const LINKS = [
  { text: "Home", href: "/", icon: Home },
  { text: "Cards", href: "/cards", icon: LightbulbIcon },
];

const PLACEHOLDER_LINKS = [
  { text: "Settings", icon: SettingsIcon },
  { text: "Support", icon: SupportIcon },
];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = await authenticatedUser();
  return (
    <html lang="en">
      <body>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton href="/" size="large" edge="start" color="inherit">
              <Style />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Vocab Card
            </Typography>
            <UserAvatar user={authUser} />
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              top: ["48px", "56px", "64px"],
              height: "auto",
              bottom: 0,
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Divider />
          <List>
            {LINKS.map(({ text, href, icon: Icon }) => (
              <ListItem key={href} disablePadding>
                <ListItemButton component={Link} href={href}>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ mt: "auto" }} />
          <List>
            {PLACEHOLDER_LINKS.map(({ text, icon: Icon }) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: `${DRAWER_WIDTH}px`,
            mt: ["48px", "56px", "64px"],
            p: 3,
          }}
        >
          {children}
        </Box>
      </body>
    </html>
  );
}
