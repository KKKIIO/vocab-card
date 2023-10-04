import prisma from "lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const createSchema = z.object({
    text: z.string().min(1).max(1000),
    // optional, empty string, or valid url
    imageUrl: z.string().url().max(1000).optional(),
})


export async function POST(request: NextRequest) {
    const body = await request.json();
    const { text, imageUrl } = createSchema.parse(body);
    const card = await prisma.card.create({
        data: {
            text,
            imageUrl,
        },
    });
    return NextResponse.json({ data: card });
}