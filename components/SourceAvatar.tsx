import { QuestionMark } from "@mui/icons-material";
import { Avatar } from "@mui/material";

export function SourceAvatar({ source }: { source: { url: string } | null }) {
  const size = 32;
  return source ? (
    (() => {
      const hostname = new URL(source.url).hostname;
      return (
        <Avatar
          alt={`${hostname} icon`}
          src={`https://icon.horse/icon/${hostname}?size=small`}
          sx={{
            width: size,
            height: size,
          }}
        />
      );
    })()
  ) : (
    <Avatar
      sx={{
        width: size,
        height: size,
      }}
    >
      <QuestionMark />
    </Avatar>
  );
}
