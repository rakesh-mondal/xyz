"use client"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, HelpCircle } from "lucide-react"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"

interface Tag {
  key: string
  value: string
}

interface ScriptsTagsSectionProps {
  sshKey: string
  startupScript: string
  tags: Tag[]
  onUpdateSshKey: (key: string) => void
  onUpdateStartupScript: (script: string) => void
  onAddTag: () => void
  onUpdateTag: (index: number, field: 'key' | 'value', value: string) => void
  onRemoveTag: (index: number) => void
}

const sshKeys = [
  { value: "key-production", label: "production-keypair" },
  { value: "key-development", label: "development-keypair" },
  { value: "key-staging", label: "staging-keypair" }
]

export function ScriptsTagsSection({
  sshKey,
  startupScript,
  tags,
  onUpdateSshKey,
  onUpdateStartupScript,
  onAddTag,
  onUpdateTag,
  onRemoveTag
}: ScriptsTagsSectionProps) {
  return (
    <>
      {/* SSH Key & Startup Script */}
      <div className="space-y-4">
        <Label className="text-base font-medium">SSH Key & Startup Script</Label>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sshKey">Select SSH Key</Label>
            <Select value={sshKey} onValueChange={onUpdateSshKey}>
              <SelectTrigger>
                <SelectValue placeholder="Choose SSH key" />
              </SelectTrigger>
              <SelectContent>
                {sshKeys.map(key => (
                  <SelectItem key={key.value} value={key.value}>
                    {key.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startupScript">
              Startup Script
              <TooltipWrapper content="Only bash format is supported. Script will run on first boot.">
                <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
              </TooltipWrapper>
            </Label>
            <Textarea
              id="startupScript"
              placeholder="#!/bin/bash&#10;# Your startup script here..."
              value={startupScript}
              onChange={(e) => onUpdateStartupScript(e.target.value)}
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              Only bash format is supported. Script will run on first boot.
            </p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Tags</Label>
        <div className="space-y-3">
          {tags.map((tag, index) => (
            <div key={index} className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Key"
                value={tag.key}
                onChange={(e) => onUpdateTag(index, 'key', e.target.value)}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Value"
                  value={tag.value}
                  onChange={(e) => onUpdateTag(index, 'value', e.target.value)}
                />
                {index === tags.length - 1 ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={onAddTag}
                  >
                    Add
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => onRemoveTag(index)}
                    className="px-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
