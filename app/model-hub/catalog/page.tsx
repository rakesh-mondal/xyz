import { PageShell } from "@/components/page-shell"

export default function ModelCatalogPage() {
  return (
    <PageShell
      title="Model Catalog"
      description="Explore our library of pre-trained AI models"
    >
      <div className="flex items-center justify-center h-[400px] border rounded-lg">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Design coming soon</h3>
          <p className="text-muted-foreground">The model catalog is currently empty.</p>
        </div>
      </div>
    </PageShell>
  )
}
