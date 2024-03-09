import { Button, MenuItem } from "@mui/material";
import { deleteCard } from "lib/actions";

export function DeleteCardMenuItem({ cardId, redirectOnSuccess }: { cardId: number, redirectOnSuccess?: string }) {
  return (
    <form action={deleteCard}>
      <input type="hidden" name="id" value={cardId} />
      {redirectOnSuccess ? <input type="hidden" name="redirectOnSuccess" value={redirectOnSuccess} /> : null}
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
