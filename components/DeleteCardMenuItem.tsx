import { Button, MenuItem } from "@mui/material";
import { deleteCard } from "lib/actions";

export function DeleteCardMenuItem({ cardId }: { cardId: number }) {
  return (
    <form action={deleteCard}>
      <input type="hidden" name="id" value={cardId} />
      <MenuItem
        key={"delete"}
        component={Button}
        type="submit"
        sx={{
          width: "100%",
          textTransform: "none",
        }}
      >
        Delete
      </MenuItem>
    </form>
  );
}
