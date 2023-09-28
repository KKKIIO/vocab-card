import React from "react";
import Layout from "../components/Layout";
import prisma from "../lib/prisma";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Link from "next/link";

export default async function Page() {
  const notes = await prisma.note.findMany({
    orderBy: [{ lastReviewedAt: "asc" }],
    take: 10,
  });

  return (
    <Layout title="Recent Notes">
      <Box>
        {notes.map((note) => (
          <Card>
            <CardActionArea component={Link} href={`/note/${note.id}`}>
              <Box sx={{ flex: "column" }}>
                {note.pictureUrl ? (
                  <CardMedia
                    component={"img"}
                    image={note.pictureUrl}
                    sx={{ height: 140 }}
                  />
                ) : null}
                <CardContent>
                  <Typography variant="body1">{note.text}</Typography>
                </CardContent>
              </Box>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Layout>
  );
}
