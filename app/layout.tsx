import { Box } from "@mui/material";
import { DrawerAppBar } from "components/DrawerAppBar";
import { authenticatedUser } from "lib/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = await authenticatedUser();
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css?family=Arvo:400,400italic,700,700italic"
          rel="stylesheet"
          type="text/css"
        />
      </head>
      <body>
        <DrawerAppBar user={authUser} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            // ml: `${DRAWER_WIDTH}px`,
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
