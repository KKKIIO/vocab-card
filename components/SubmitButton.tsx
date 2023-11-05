"use client";
import { LoadingButton } from "@mui/lab";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  startIcon,
  children,
}: {
  startIcon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <LoadingButton startIcon={startIcon} type="submit" loading={pending}>
      {children}
    </LoadingButton>
  );
}
