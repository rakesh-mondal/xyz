"use client"
import { useState, useRef } from "react"

import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CreateVolumePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVpc, setSelectedVpc] = useState("")
  
  // Refs for form fields
  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const name = nameRef.current?.value.trim() || ""
    const description = descriptionRef.current?.value.trim() || ""
    
    if (!name || !selectedVpc) {
      setError("Please fill all required fields.")
      setLoading(false)
      return
    }
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      window.location.href = "/storage/block"
    } catch (err) {
      setError("Failed to create volume. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout
      title="Create Volume"
      description="Provision a new block storage volume for your cloud resources."
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="space-y-6 pt-6">
            <form onSubmit={handleSubmit}>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="volume-name">Volume Name <span className="text-destructive">*</span></Label>
                    <Input 
                      id="volume-name" 
                      ref={nameRef} 
                      placeholder="Enter volume name" 
                      required 
                      className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Only alphanumeric characters, hyphens, and underscores allowed.
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      ref={descriptionRef} 
                      placeholder="Enter description" 
                      className="focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[80px]"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="vpc">VPC <span className="text-destructive">*</span></Label>
                    <Select value={selectedVpc} onValueChange={setSelectedVpc} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a VPC" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vpc-12345">Default VPC (vpc-12345)</SelectItem>
                        <SelectItem value="vpc-67890">Production VPC (vpc-67890)</SelectItem>
                        <SelectItem value="vpc-54321">Development VPC (vpc-54321)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="size">Volume Size (GB)</Label>
                    <Input 
                      id="size" 
                      type="number"
                      placeholder="50" 
                      min="1"
                      max="1000"
                      defaultValue="50"
                      className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum 1 GB, Maximum 1000 GB
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => window.location.href = "/storage/block"}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-black text-white hover:bg-black/90"
                >
                  {loading ? "Creating..." : "Create Volume"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
} 