"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function CreateVMPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [vmName, setVmName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "VM creation initiated",
      description: `${vmName} is being created. This may take a few minutes.`
    })
    router.push("/compute/vms")
  }

  return (
    <PageLayout
      title="Create Virtual Machine"
      description="Configure and deploy a new virtual machine instance"
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="space-y-6 pt-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="block mb-2 font-medium">
                    VM Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter VM name"
                    value={vmName}
                    onChange={(e) => setVmName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/compute/vms")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-black text-white hover:bg-black/90"
                    disabled={!vmName}
                  >
                    Create VM
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}