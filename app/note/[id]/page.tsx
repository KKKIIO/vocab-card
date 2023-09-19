import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import prisma from "../../../lib/prisma";
import Layout from "../../../components/Layout";

export default async function Page({ params }: { params: { id: string } }) {
    const note = await prisma.note.findUnique({
        where: {
            id: Number(params.id),
        },
    })

    return (
        <Layout title="Note">
            <Card>
                {(note.pictureUrl ? <CardMedia component={"img"} image={note.pictureUrl} sx={{ height: 140 }} /> : null)}
                <CardContent>
                    <Typography variant="body1">{note.text}</Typography>
                </CardContent>
            </Card>
        </Layout>
    )
}