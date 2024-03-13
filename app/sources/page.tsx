
import { Delete } from "@mui/icons-material";
import {
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText, Link as MuiLink,
    Paper,
    Stack
} from "@mui/material";
import { requireDefaultDesk } from "app/desks/query";
import { MyPagination } from "components/MyPagination";
import { SourceAvatar } from "components/SourceAvatar";
import { authenticatedUser } from "lib/auth";
import prisma from "lib/prisma";
import { deleteSource } from "./actions";

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        page?: string;
    };
}) {
    const user = await authenticatedUser();
    const desk = await requireDefaultDesk(user.id);
    const pageSize = 10;
    const totalCount = await prisma.source.count({
        where: { deskId: desk.id },
    });
    let page = 1;
    if (searchParams?.page) {
        const requestPage = Number.parseInt(searchParams.page, 10);
        if (requestPage > 0) {
            page = requestPage;
        }
    }
    const sources = await prisma.source.findMany({
        include: {
            _count: {
                select: { cards: true }
            }
        },
        where: { deskId: desk.id },
        orderBy: [{ createdAt: "desc" }],
        take: pageSize,
        skip: (page - 1) * pageSize,
    });
    const pageCount = Math.ceil(totalCount / pageSize);

    return (
        <Stack spacing={2}>
            <Paper>
                <List >
                    {sources.map((source) => {
                        return (
                            <ListItem key={source.id}
                                secondaryAction={
                                    <form action={deleteSource}>
                                        <input type="hidden" name="id" value={source.id} />
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            type="submit"
                                            disabled={source._count.cards > 0}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </form>
                                }
                            >
                                <ListItemAvatar>
                                    <SourceAvatar source={source} />
                                </ListItemAvatar>
                                <ListItemText primary={source.name} secondary={
                                    <MuiLink
                                        href={source.url}
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {source.url}
                                    </MuiLink>
                                } />
                            </ListItem>
                        );
                    })}
                </List>
            </Paper>
            <MyPagination path={"/sources"} count={pageCount} defaultPage={page} />
        </Stack>

    );
}

