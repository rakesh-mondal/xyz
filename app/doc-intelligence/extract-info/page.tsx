import { PageShell } from "@/components/page-shell"

export default function ExtractInfoPage() {
  return (
    <PageShell
      title="Extract Information"
      description="Extract structured information from unstructured documents"
      tabs={[
        { title: "Overview", href: "/doc-intelligence/extract-info" },
        { title: "Forms", href: "/doc-intelligence/extract-info/forms" },
        { title: "Entities", href: "/doc-intelligence/extract-info/entities" },
        { title: "Custom Extraction", href: "/doc-intelligence/extract-info/custom" },
      ]}
    >
      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Information Extraction</h2>
          <p className="text-muted-foreground mb-4">
            Our information extraction service allows you to identify and extract key data points from documents.
            Extract names, dates, addresses, financial figures, and other structured information from unstructured text.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Form Processing</h3>
              <p className="text-sm text-muted-foreground">
                Extract key-value pairs from forms, invoices, and structured documents.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Entity Extraction</h3>
              <p className="text-sm text-muted-foreground">
                Identify and extract names, organizations, locations, dates, and custom entities.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Custom Models</h3>
              <p className="text-sm text-muted-foreground">
                Train custom extraction models specific to your document types and information needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
