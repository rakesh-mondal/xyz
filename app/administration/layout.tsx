import type React from "react"

export default function AdministrationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
} 