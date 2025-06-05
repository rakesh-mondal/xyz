import { redirect } from "next/navigation"

export default function BlockStorageRoot() {
  redirect("/storage/block/volumes")
  return null
}
