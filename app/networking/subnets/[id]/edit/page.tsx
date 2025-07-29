"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { PageLayout } from "../../../../../components/page-layout"
import { Card, CardContent } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Textarea } from "../../../../../components/ui/textarea"
import { Label } from "../../../../../components/ui/label"
import { getSubnet } from "../../../../../lib/data"
import { useToast } from "../../../../../hooks/use-toast"

export default function EditSubnetPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const subnet = getSubnet(params.id)

  if (!subnet) {
    notFound()
  }

  const [formData, setFormData] = useState({
    description: subnet.description,
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // In a real app, this would update the subnet via API
      console.log("Updating subnet description:", formData)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Subnet Updated",
        description: `Subnet "${subnet.name}" description has been updated successfully!`
      })
      
      router.push(`/networking/subnets/${params.id}`)
    } catch (error) {
      console.error("Error updating subnet:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update subnet description. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const customBreadcrumbs = [
    { href: "/dashboard", title: "Home" },
    { href: "/networking", title: "Networking" },
    { href: "/networking/subnets", title: "Subnets" },
    { href: `/networking/subnets/${subnet.id}`, title: subnet.name },
    { href: `/networking/subnets/${subnet.id}/edit`, title: "Edit" }
  ]

  return (
    <PageLayout 
      title={`Edit ${subnet.name}`}
      description="Update subnet description"
      customBreadcrumbs={customBreadcrumbs}
      hideViewDocs={true}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <div className="mb-5">
                    <Label htmlFor="description" className="block mb-2 font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Enter subnet description"
                      value={formData.description}
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[80px]"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Provide a description for this subnet to help with identification and management.
                    </p>
                  </div>
                </div>
              </form>
            </CardContent>
            <div className="flex justify-end gap-4 px-6 pb-6">
              <Button
                type="button"
                variant="outline"
                className="hover:bg-secondary transition-colors"
                onClick={() => router.push(`/networking/subnets/${params.id}`)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-black text-white hover:bg-black/90 transition-colors"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Description"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-base font-semibold mb-4">Best Practices</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Keep descriptions clear and informative for easy resource identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Include the purpose and environment of the subnet in the description</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Use consistent naming conventions across your infrastructure</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
} 