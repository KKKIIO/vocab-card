"use client";
import { Pagination, PaginationItem } from "@mui/material";
import Link from "next/link";

export function CardsPagination({
  count,
  defaultPage,
}: {
  count: number;
  defaultPage: number;
}) {
  return (
    <Pagination
      count={count}
      defaultPage={defaultPage}
      shape="rounded"
      sx={{
        alignSelf: "center",
      }}
      renderItem={(item) => {
        return (
          <PaginationItem
            component={Link}
            href={`/cards?page=${item.page}`}
            {...item}
          />
        );
      }}
    />
  );
}
