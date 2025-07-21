import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FolderIcon } from "@heroicons/react/24/outline"

interface CreateBackupModalProps {
  open: boolean
  onClose: () => void
  onCreate: (data: { name: string; description: string; tags: string[] }) => Promise<void>
  price?: string
  volume?: { name: string; size: string; type: string }
}

export function CreateBackupModal({ open, onClose, onCreate, price, volume }: CreateBackupModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput])
      setTagInput("")
    }
  }
  const handleRemoveTag = (tag: string) => setTags(tags.filter(t => t !== tag))

  const handleCreate = async () => {
    if (!name) return
    setLoading(true)
    try {
      await onCreate({ name, description, tags })
      onClose()
      setName("")
      setDescription("")
      setTags([])
      setTagInput("")
    } catch (error) {
      console.error("Error creating backup:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Create Instant Backup
          </DialogTitle>
          <DialogDescription>
            Create a backup of your volume data for data protection and recovery purposes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {volume && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="space-y-3 mb-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Volume Name:</span>
                  <span className="text-sm font-medium">{volume.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Size:</span>
                  <span className="text-sm font-medium">{volume.size} GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Volume Type:</span>
                  <span className="text-sm font-medium">{volume.type}</span>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Backup Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter backup name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter backup description (optional)"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {tags.map(tag => (
                <span key={tag} className="bg-gray-200 rounded px-2 py-1 text-sm flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="text-gray-500 hover:text-red-500 ml-1">×</button>
                </span>
              ))}
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }}}
                placeholder="Add tag"
                className="w-32"
              />
              <Button type="button" size="sm" variant="outline" onClick={handleAddTag}>Add</Button>
            </div>
          </div>
          {price && (
            <div 
              className="p-4 rounded-lg mt-2" 
              style={{
                boxShadow: "rgba(14, 114, 180, 0.1) 0px 0px 0px 1px inset",
                background: "linear-gradient(263deg, rgba(15, 123, 194, 0.08) 6.86%, rgba(15, 123, 194, 0.02) 96.69%)"
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-black">Pricing Summary</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-black">Backup Price:</span>
                <span className="font-semibold text-black">{price}</span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            disabled={loading || !name}
          >
            {loading ? "Creating..." : "Create Backup"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 