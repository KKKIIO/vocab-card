"use client";
import { Pagination, PaginationItem } from "@mui/material";
import Link from "next/link";

export function MyPagination({
  path,
  count,
  defaultPage,
}: {
  path: string;
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
            href={`${path}?page=${item.page}`}
            {...item}
          />
        );
      }}
    />
  );
}
