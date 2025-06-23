import type React from "react"

export default function ApisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-auto">
      <div className="p-4">
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}
