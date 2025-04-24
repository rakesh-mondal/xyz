import type React from "react"
export default function MockupsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="h-[calc(100vh-4rem)] overflow-auto">{children}</div>
}
