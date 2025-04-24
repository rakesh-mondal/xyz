import { PageShell } from "@/components/page-shell"

export default function BhashikTextPage() {
  return (
    <PageShell
      title="Text Services"
      description="Explore and utilize Bhashik's comprehensive text processing services"
      tabs={[
        { title: "Overview", href: "/bhashik/text" },
        { title: "Translation", href: "/bhashik/text/translation" },
        { title: "Sentiment Analysis", href: "/bhashik/text/sentiment" },
        { title: "Entity Recognition", href: "/bhashik/text/entities" },
      ]}
    >
      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Language Processing Capabilities</h2>
          <p className="text-muted-foreground mb-4">
            Bhashik offers state-of-the-art natural language processing capabilities for Indian and global languages.
            Our text services provide powerful tools for understanding, analyzing, and transforming text across multiple
            languages and domains.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Multi-lingual Translation</h3>
              <p className="text-sm text-muted-foreground">
                Translate text between 100+ language pairs with high accuracy.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Sentiment Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Understand the emotional tone and opinion in text content.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Entity Recognition</h3>
              <p className="text-sm text-muted-foreground">
                Identify and classify named entities in unstructured text.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
