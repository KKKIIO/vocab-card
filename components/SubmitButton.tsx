"use client";
import { LoadingButton } from "@mui/lab";
import { useFormStatus } from "react-dom";

export function SubmitButton(props) {
  const { pending } = useFormStatus();
  return (
    <LoadingButton
      type="submit"
      loading={pending}
      {...props}
    ></LoadingButton>
  );
}
