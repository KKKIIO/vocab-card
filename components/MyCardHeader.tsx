import { CardHeader, Link as MuiLink, Typography } from "@mui/material";
import { SourceAvatar } from "components/SourceAvatar";
import dayjs from "lib/dayjs";
import { ReactNode } from "react";

export function MyCardHeader({ card, action }: {
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
    action?: JSX.Element & ReactNode;
}) {
    return <CardHeader
        avatar={<SourceAvatar source={card.source} />}
        action={action}
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
