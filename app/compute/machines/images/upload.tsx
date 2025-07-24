import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"

const IMAGE_TYPES = [
  { value: "Linux", label: "Linux" },
  { value: "Windows", label: "Windows" },
  { value: "Other", label: "Other" },
]

export default function UploadMachineImagePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    setFile(f)
    setError("")
    if (f) {
      // Simulate file size check (max 1024 GB)
      const maxBytes = 1024 * 1024 * 1024 * 1024
      if (f.size > maxBytes) {
        setError("File size exceeds 1024 GB limit.")
        setFile(null)
        return
      }
      // Simulate magic byte (MIME) check (mocked)
      const allowedTypes = ["application/octet-stream", "application/x-iso9660-image", "application/x-img"]
      if (!allowedTypes.includes(f.type) && !f.name.endsWith(".img") && !f.name.endsWith(".iso")) {
        setError("File type not allowed. Only valid disk images are accepted.")
        setFile(null)
        return
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!name.trim()) {
      setError("Machine Image Name is required.")
      return
    }
    if (!type) {
      setError("Image type is required.")
      return
    }
    if (!file) {
      setError("Please select a file to upload.")
      return
    }
    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      // Simulate success and redirect
      router.push("/compute/machines/images")
    }, 1200)
  }

  return (
    <PageLayout title="Upload Machine Image" description="Upload a new machine image for your account.">
      <form className="max-w-xl mx-auto space-y-6 mt-8" onSubmit={handleSubmit} id="machine-image-upload-form">
        <div>
          <label className="block text-base font-medium mb-1" htmlFor="mi-name">Machine Image Name<span className="text-red-500">*</span></label>
          <Input id="mi-name" value={name} onChange={e => setName(e.target.value)} required disabled={uploading} />
        </div>
        <div>
          <label className="block text-base font-medium mb-1" htmlFor="mi-type">Image Type<span className="text-red-500">*</span></label>
          <Select value={type} onValueChange={setType} disabled={uploading} required>
            <SelectTrigger id="mi-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {IMAGE_TYPES.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-base font-medium mb-1" htmlFor="mi-file">Upload Image<span className="text-red-500">*</span></label>
          <Input id="mi-file" type="file" accept=".img,.iso" onChange={handleFileChange} disabled={uploading} required />
          <div className="text-xs text-muted-foreground mt-1">Max file size: 1024 GB. Only valid disk images (.img, .iso) allowed. Magic Byte (MIME) check enforced.</div>
        </div>
        {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => router.push("/compute/machines/images")} disabled={uploading}>Cancel</Button>
          <Button type="submit" disabled={uploading}>{uploading ? "Uploading..." : "Confirm"}</Button>
        </div>
      </form>
    </PageLayout>
  )
} 