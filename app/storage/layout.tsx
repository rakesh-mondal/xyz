import type React from "react"

export default function StorageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-auto">
      <div className="p-6">{children}</div>
    </div>
  )
}
