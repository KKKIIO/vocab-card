import { CardHeader, MenuItem, Link as MuiLink, Typography, } from "@mui/material";
import { CardActionsMenu } from "components/CardActionsMenu";
import { CopyCardJsonMenuItem } from "components/CopyCardJsonMenuItem";
import { DeleteCardMenuItem } from "components/DeleteCardMenuItem";
import { SourceAvatar } from "components/SourceAvatar";
import dayjs from "lib/dayjs";
import Link from "next/link";

export function MyCardHeader({ card, redirectOnSuccess }: {
    card: {
        id: number;
        text: string;
        imageUrl: string | null;
        createdAt: Date;
        source: {
            name: string;
            url: string;
        } | null;
    };
    redirectOnSuccess?: string
}) {
    return <CardHeader
        avatar={<SourceAvatar source={card.source} />}
        action={<CardActionsMenu>
            <MenuItem
                key={"edit"}
                component={Link}
                href={`/cards/${card.id}/edit`}
            >
                Edit
            </MenuItem>
            <DeleteCardMenuItem cardId={card.id} redirectOnSuccess={redirectOnSuccess} />
            <CopyCardJsonMenuItem card={card} />
        </CardActionsMenu>}
        title={
            card.source ? (
                <SourceLink source={card.source}></SourceLink>
            ) : null
        }
        subheader={
            <Typography variant="body2" color="text.secondary" suppressHydrationWarning >
                {dayjs(card.createdAt).format("YYYY/MM/DD")}
            </Typography>
        } />;
}

function SourceLink({ source }: { source: { name: string; url: string } }) {
    return (
        <MuiLink
            href={source.url}
            variant="body2"
            color="text.secondary"
            sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: "4",
            }}
        >
            {source.name}
        </MuiLink>
    );
}
