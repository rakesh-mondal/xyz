// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'
export const revalidate = 0

import { CreateVMClient } from './create-vm-client'

export default function CreateVMPage() {
  return <CreateVMClient />
} 