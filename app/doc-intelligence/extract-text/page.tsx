import { PageShell } from "@/components/page-shell"

export default function ExtractTextPage() {
  return (
    <PageShell
      title="Extract Text"
      description="Extract and process text from documents, images, and scanned files"
      tabs={[
        { title: "Overview", href: "/doc-intelligence/extract-text" },
        { title: "OCR", href: "/doc-intelligence/extract-text/ocr" },
        { title: "Handwriting", href: "/doc-intelligence/extract-text/handwriting" },
        { title: "Table Extraction", href: "/doc-intelligence/extract-text/tables" },
      ]}
    >
      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Document Text Extraction</h2>
          <p className="text-muted-foreground mb-4">
            Our text extraction services use advanced optical character recognition (OCR) and AI models to extract text
            from various document formats, including scanned documents, PDFs, images, and handwritten notes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">OCR Processing</h3>
              <p className="text-sm text-muted-foreground">
                Convert printed text from images and PDF documents into machine-readable text.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Handwriting Recognition</h3>
              <p className="text-sm text-muted-foreground">
                Extract text from handwritten documents and notes with high accuracy.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Layout Preservation</h3>
              <p className="text-sm text-muted-foreground">
                Maintain the original document structure including tables, columns, and formatting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
