"use client";
import { Pagination, PaginationItem } from "@mui/material";
import Link from "next/link";

export function CardsPagination({ pageCount }: { pageCount: number }) {
  return (
    <Pagination
      count={pageCount}
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
