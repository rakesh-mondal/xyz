"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreVertical, Eye, Edit, Trash2, ArrowUpRight, AlertTriangle } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import Link from "next/link"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"

interface ActionMenuProps {
  viewHref?: string
  editHref?: string
  deleteHref?: string
  resourceName?: string
  resourceType?: string
  onExtend?: () => void
  onWarning?: () => void
  onEdit?: () => void
}

/**
 * @component ActionMenu
 * @description A dropdown menu for common actions like view, edit, and delete
 * @status Active
 * @example
 * <ActionMenu
 *   viewHref="/resources/123"
 *   editHref="/resources/123/edit"
 *   deleteHref="/resources/123/delete"
 *   resourceName="example-resource"
 *   resourceType="Resource"
 * />
 */
export function ActionMenu({
  viewHref,
  editHref,
  deleteHref,
  resourceName = "this resource",
  resourceType = "Resource",
  onExtend,
  onWarning,
  onEdit,
}: ActionMenuProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const router = useRouter()

  const handleDelete = () => {
    if (deleteHref) {
      router.push(deleteHref)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="border-border min-w-[180px]">
          {viewHref && (
            <DropdownMenuItem asChild>
              <Link href={viewHref} className="flex items-center cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                <span>View</span>
              </Link>
            </DropdownMenuItem>
          )}
          {editHref && (
            <DropdownMenuItem asChild>
              <Link href={editHref} className="flex items-center cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </Link>
            </DropdownMenuItem>
          )}
          {onExtend && (
            <DropdownMenuItem onClick={onExtend} className="flex items-center cursor-pointer">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              <span>Extend</span>
            </DropdownMenuItem>
          )}
          {onWarning && (
            <DropdownMenuItem onClick={onWarning} className="flex items-center cursor-pointer">
              <AlertTriangle className="mr-2 h-4 w-4 text-yellow-600" />
              <span>VM Warning</span>
            </DropdownMenuItem>
          )}
          {onEdit && (
            <DropdownMenuItem onClick={onEdit} className="flex items-center cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
          )}
          {deleteHref && (
            <DropdownMenuItem
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center text-destructive focus:text-destructive cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        resourceName={resourceName}
        resourceType={resourceType}
        onConfirm={handleDelete}
      />
    </>
  )
}
