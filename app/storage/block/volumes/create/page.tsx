"use client"
import { useState, useRef } from "react"

import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { vpcs } from "@/lib/data"

export default function CreateVolumePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVpc, setSelectedVpc] = useState("")
  const [volumeType, setVolumeType] = useState("hnss")
  const [source, setSource] = useState("none")
  const [size, setSize] = useState([100])
  const [tags, setTags] = useState([{ key: "", value: "" }])
  
  // Refs for form fields
  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const name = nameRef.current?.value.trim() || ""
    
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

  const addTag = () => {
    setTags([...tags, { key: "", value: "" }])
  }

  const updateTag = (index: number, field: 'key' | 'value', value: string) => {
    const newTags = [...tags]
    newTags[index][field] = value
    setTags(newTags)
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const calculatePrice = () => {
    const pricePerGB = 0.10
    const totalPrice = size[0] * pricePerGB
    return totalPrice.toFixed(2)
  }

  return (
    <PageLayout
      title="Create Volume"
      description="Provision a new block storage volume for your cloud resources."
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {/* Basic Configuration */}
                <div className="mb-8">
                  <div className="mb-5">
                    <Label htmlFor="volume-name" className="block mb-2 font-medium">
                      Volume Name <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      id="volume-name" 
                      ref={nameRef} 
                      placeholder="Enter volume name" 
                      required 
                      className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Only alphanumeric characters, hyphens, and underscores allowed.
                    </p>
                  </div>
                  
                  <div className="mb-5">
                    <Label htmlFor="description" className="block mb-2 font-medium">
                      Description
                    </Label>
                    <Textarea 
                      id="description" 
                      ref={descriptionRef} 
                      placeholder="Enter description" 
                      className="focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[80px]"
                    />
                  </div>
                  
                  {/* VPC Selection */}
                  <div className="mb-5">
                    <Label htmlFor="vpc" className="block mb-2 font-medium">
                      VPC <span className="text-destructive">*</span>
                    </Label>
                    <Select value={selectedVpc} onValueChange={setSelectedVpc} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select VPC" />
                      </SelectTrigger>
                      <SelectContent>
                        {vpcs.map((vpc) => (
                          <SelectItem key={vpc.id} value={vpc.id}>
                            {vpc.name} ({vpc.id}) - {vpc.region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <div>
                      <Label htmlFor="volume-type" className="block mb-2 font-medium">
                        Volume Type <span className="text-destructive">*</span>
                      </Label>
                      <Select value={volumeType} onValueChange={setVolumeType} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select volume type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hnss">High-speed NVME SSD storage (HNSS)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">xxx MBPS Throughput</p>
                    </div>

                    <div>
                      <Label htmlFor="source" className="block mb-2 font-medium">
                        Source <span className="text-destructive">*</span>
                      </Label>
                      <Select value={source} onValueChange={setSource} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None (create empty volume)</SelectItem>
                          <SelectItem value="snapshot">Snapshot</SelectItem>
                          <SelectItem value="machine-image">Machine Image</SelectItem>
                          <SelectItem value="volume">Other Volume</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Size Selection */}
                  <Card className="mb-5">
                    <CardContent className="pt-4">
                      <Label htmlFor="size" className="block mb-3 font-medium">
                        Size (GB) <span className="text-destructive">*</span>
                      </Label>
                      
                      <div className="space-y-4">
                        {/* Quick Presets + Custom Input Row */}
                        <div className="flex items-end gap-3">
                          <div className="flex-1">
                            <Label className="text-xs text-muted-foreground mb-2 block">Quick Select</Label>
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                { size: 20, label: "20GB" },
                                { size: 100, label: "100GB" },
                                { size: 500, label: "500GB" },
                                { size: 1000, label: "1TB" }
                              ].map((preset) => (
                                <Button
                                  key={preset.size}
                                  type="button"
                                  variant={size[0] === preset.size ? "default" : "outline"}
                                  size="sm"
                                  className={`h-9 text-xs font-medium ${
                                    size[0] === preset.size ? "bg-primary text-primary-foreground" : ""
                                  }`}
                                  onClick={() => setSize([preset.size])}
                                >
                                  {preset.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="w-28">
                            <Label className="text-xs text-muted-foreground mb-2 block">Custom</Label>
                            <div className="relative">
                              <Input
                                type="number"
                                value={size[0]}
                                onChange={(e) => {
                                  const value = Math.max(4, Math.min(2048, Number(e.target.value) || 4))
                                  setSize([value])
                                }}
                                className="w-full h-9 text-xs text-center pr-8"
                                min={4}
                                max={2048}
                              />
                              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">GB</span>
                            </div>
                          </div>
                        </div>

                        {/* Slider */}
                        <div className="space-y-2">
                          <Slider
                            value={size}
                            onValueChange={setSize}
                            max={2048}
                            min={4}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>4 GB</span>
                            <span>2048 GB</span>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <span className="text-sm font-medium">{size[0]} GB Selected</span>
                              <span className="text-xs text-muted-foreground px-2 py-0.5 bg-white rounded">
                                {size[0] <= 50 ? "Development" : size[0] <= 200 ? "Small App" : size[0] <= 800 ? "Production" : "Enterprise"}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-primary">₹{calculatePrice()}/mo</div>
                              <div className="text-xs text-muted-foreground">₹{(Number(calculatePrice()) * 12).toFixed(2)}/year</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tags */}
                  <div className="mb-5">
                    <Label className="block mb-2 font-medium">Tags</Label>
                    <div className="space-y-3">
                      {tags.map((tag, index) => (
                        <div key={index} className="grid grid-cols-2 gap-3">
                          <Input
                            placeholder="Key"
                            value={tag.key}
                            onChange={(e) => updateTag(index, 'key', e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Input
                              placeholder="Value"
                              value={tag.value}
                              onChange={(e) => updateTag(index, 'value', e.target.value)}
                            />
                            {tags.length > 1 ? (
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => removeTag(index)}
                              >
                                Remove
                              </Button>
                            ) : (
                              <Button type="button" variant="outline" size="sm" onClick={addTag}>
                                Add Tag
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => window.location.href = "/storage/block"}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create Volume"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="w-80 flex-shrink-0">
          <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                Pricing Summary
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                  First Volume
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Storage ({size[0]} GB)</span>
                  <span className="font-medium">₹{calculatePrice()}/month</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-bold text-primary">₹{calculatePrice()}/month</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white/70 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Configuration Tips</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Choose size based on your application needs</li>
                  <li>• HNSS provides high-performance storage</li>
                  <li>• Consider backup policies for data protection</li>
                  <li>• Tags help organize and track resources</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
} 