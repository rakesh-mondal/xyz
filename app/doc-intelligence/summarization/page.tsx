import { PageShell } from "@/components/page-shell"

export default function SummarizationPage() {
  return (
    <PageShell
      title="Document Summarization"
      description="Automatically generate concise summaries of documents and text content"
      tabs={[
        { title: "Overview", href: "/doc-intelligence/summarization" },
        { title: "Extractive", href: "/doc-intelligence/summarization/extractive" },
        { title: "Abstractive", href: "/doc-intelligence/summarization/abstractive" },
        { title: "Custom Summarization", href: "/doc-intelligence/summarization/custom" },
      ]}
    >
      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Text Summarization</h2>
          <p className="text-muted-foreground mb-4">
            Our document summarization service uses advanced AI to create concise summaries of long documents, reports,
            articles, and other text content. Extract key information while reducing reading time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Extractive Summarization</h3>
              <p className="text-sm text-muted-foreground">
                Create summaries by extracting key sentences from the original document.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Abstractive Summarization</h3>
              <p className="text-sm text-muted-foreground">
                Generate human-like summaries with new phrasing and structure.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Length Control</h3>
              <p className="text-sm text-muted-foreground">
                Customize summary length based on your specific requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
