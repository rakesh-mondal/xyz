import { redirect } from "next/navigation";

export default function UsageRootRedirect() {
  redirect("/billing/usage/summary");
  return null;
}
