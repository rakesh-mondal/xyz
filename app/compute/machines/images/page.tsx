import { PageLayout } from "@/components/page-layout"

export default function MachineImagesPage() {
  return (
    <PageLayout title="Machine Images" description="Manage your machine images">
      <div className="flex items-center justify-center h-[400px] border rounded-lg">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Machine Images</h3>
          <p className="text-muted-foreground">This is a placeholder for the Machine Images content</p>
        </div>
      </div>
    </PageLayout>
  )
}
