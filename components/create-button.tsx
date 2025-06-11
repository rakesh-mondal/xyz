import Link from "next/link"
import { Button } from "./ui/button"
import { PlusIcon } from "@heroicons/react/24/outline"

interface CreateButtonProps {
  href: string
  label: string
}

/**
 * @component CreateButton
 * @description A button for creating new resources
 * @status Active
 * @example
 * <CreateButton href="/networking/vpc/create" label="Create VPC" />
 */
export function CreateButton({ href, label }: CreateButtonProps) {
  return (
    <Button asChild>
      <Link href={href} className="flex items-center">
        {label}
      </Link>
    </Button>
  )
}
