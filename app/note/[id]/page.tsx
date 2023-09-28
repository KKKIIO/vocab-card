import prisma from "../../../lib/prisma";
import Layout from "../../../components/Layout";
import Note from "./Note";

export default async function Page({ params }: { params: { id: string } }) {
    const note = await prisma.note.findUnique({
        where: {
            id: Number(params.id),
        },
    })

    return (
        <Layout title="Note">
            <Note note={note} />
        </Layout>
    )
}