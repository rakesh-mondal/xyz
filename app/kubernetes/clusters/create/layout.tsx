import React from "react"
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'
export const revalidate = false

export default async function CreateClusterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Force server-side rendering by accessing headers
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  
  return children
}
