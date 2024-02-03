import { Container, CssBaseline } from "@mui/material";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">{children}</Container>
    </>
  );
}
