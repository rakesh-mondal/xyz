"use client"

import { PageLayout } from "@/components/page-layout"
import { ShadcnDataTable, Column } from "@/components/ui/shadcn-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { sshKeys as mockSshKeys } from "@/lib/data"
import { CreateButton } from "@/components/create-button"
import { MoreVertical } from "lucide-react"
import { StatusBadge } from "@/components/status-badge"

const regions = [
  { value: "us-east-1", label: "US East 1" },
  { value: "us-west-2", label: "US West 2" },
  { value: "eu-west-1", label: "EU West 1" },
  { value: "ap-south-1", label: "AP South 1" },
  { value: "us-central-1", label: "US Central 1" },
]

export default function SshKeysPage() {
  const [data, setData] = useState(mockSshKeys)
  const [showCreate, setShowCreate] = useState(false)
  const [showRotate, setShowRotate] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [selectedKey, setSelectedKey] = useState<any>(null)
  const [form, setForm] = useState({ region: '', name: '', publicKey: '' })
  const [deleteError, setDeleteError] = useState('')

  // Table columns
  const columns: Column[] = [
    {
      key: "name",
      label: "Key name",
      sortable: true,
      searchable: true,
      render: (value) => <span className="font-medium text-sm">{value}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value, row) => (
        <StatusBadge status={value} />
      ),
    },
    {
      key: "attachedVMs",
      label: "Attached VM name",
      render: (value) => value && value.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {value.map((vm: string) => (
            <span key={vm} className="bg-gray-100 rounded px-2 py-0.5 text-xs font-mono">{vm}</span>
          ))}
        </div>
      ) : <span className="text-muted-foreground text-xs">None</span>,
    },
    {
      key: "region",
      label: "Region",
      render: (value) => regions.find(r => r.value === value)?.label || value,
    },
    {
      key: "createdOn",
      label: "Created on",
      sortable: true,
      render: (value) => (
        <div className="text-muted-foreground leading-5">
          {new Date(value).toLocaleString()}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (_: any, row: any) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={!row.isExpired}
                onClick={() => { setSelectedKey(row); setForm({ region: row.region, name: row.name, publicKey: '' }); setShowRotate(true); }}
                className="flex items-center"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4.05 11A8.001 8.001 0 0 1 12 4a8 8 0 0 1 8 8"/><polyline points="21 7 21 12 16 12"/></svg>
                <span>Rotate key</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => { setSelectedKey(row); setShowDelete(true); setDeleteError(''); }}
                className="flex items-center text-destructive focus:text-destructive"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6m-6 0V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"/></svg>
                <span>Delete key</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  // Handlers
  const handleCreate = () => {
    setData([
      ...data,
      {
        id: `ssh-${data.length + 1}`,
        name: form.name,
        status: "active",
        isActive: true,
        isExpired: false,
        attachedVMs: [],
        region: form.region,
        createdOn: new Date().toISOString(),
        publicKey: form.publicKey,
      },
    ])
    setShowCreate(false)
    setForm({ region: '', name: '', publicKey: '' })
  }

  const handleRotate = () => {
    if (!selectedKey) return;
    setData(data.map(k => k.id === selectedKey.id ? {
      ...k,
      publicKey: form.publicKey,
      status: "active",
      isActive: true,
      isExpired: false,
    } : k))
    setShowRotate(false)
    setForm({ region: '', name: '', publicKey: '' })
    setSelectedKey(null)
  }

  const handleDelete = () => {
    if (!selectedKey) return;
    if (selectedKey.attachedVMs && selectedKey.attachedVMs.length > 0) {
      setDeleteError('Key is attached to a VM. Delete the VM before deleting the key.')
      return
    }
    setData(data.filter(k => k.id !== selectedKey.id))
    setShowDelete(false)
    setSelectedKey(null)
  }

  return (
    <PageLayout
      title="SSH Keys"
      description="Manage your SSH keys"
      headerActions={
        <Button onClick={() => { setShowCreate(true); setForm({ region: '', name: '', publicKey: '' }) }}>
          Create key
        </Button>
      }
    >
      <ShadcnDataTable columns={columns} data={data} searchableColumns={["name"]} defaultSort={{ column: "createdOn", direction: "desc" }} />

      {/* Create Key Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create SSH Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Region</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.region}
                onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
                required
              >
                <option value="">Select region</option>
                {regions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Public key</label>
              <Input value={form.publicKey} onChange={e => setForm(f => ({ ...f, publicKey: e.target.value }))} required />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleCreate} disabled={!form.region || !form.name || !form.publicKey}>Create</Button>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rotate Key Modal */}
      <Dialog open={showRotate} onOpenChange={setShowRotate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rotate SSH Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Region</label>
              <Input value={form.region} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input value={form.name} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Public key</label>
              <Input value={form.publicKey} onChange={e => setForm(f => ({ ...f, publicKey: e.target.value }))} required />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleRotate} disabled={!form.publicKey || !selectedKey}>Rotate key</Button>
            <Button variant="outline" onClick={() => setShowRotate(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Key Modal */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete SSH Key</DialogTitle>
          </DialogHeader>
          {deleteError ? (
            <div className="text-red-600 text-sm mb-2">{deleteError}</div>
          ) : (
            <div className="mb-2 text-sm">Are you sure you want to delete this SSH key?</div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button onClick={handleDelete} variant="destructive" disabled={!!deleteError || !selectedKey}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}
