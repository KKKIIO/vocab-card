import { CardMedia } from "@mui/material";

export function CardImage({ imageUrl }: { imageUrl: string }) {
  return <CardMedia component={"img"} image={imageUrl} />;
}
