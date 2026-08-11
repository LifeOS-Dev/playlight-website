import { createFileRoute, redirect } from "@tanstack/react-router";

/** Claude v3 is now the homepage — keep this path as an alias. */
export const Route = createFileRoute("/v3")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
