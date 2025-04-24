import { PageShell } from "@/components/page-shell"

export default function ModelCatalogPage() {
  return (
    <PageShell
      title="Model Catalog"
      description="Explore our library of pre-trained AI models"
      tabs={[
        { title: "All Models", href: "/model-hub/catalog" },
        { title: "Vision Models", href: "/model-hub/catalog/vision" },
        { title: "Language Models", href: "/model-hub/catalog/language" },
        { title: "Multimodal Models", href: "/model-hub/catalog/multimodal" },
      ]}
    >
      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">AI Model Library</h2>
          <p className="text-muted-foreground mb-4">
            Browse our extensive collection of pre-trained AI models. Find and deploy state-of-the-art models for
            various tasks including computer vision, natural language processing, speech, and multimodal applications.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Computer Vision</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Models for image classification, object detection, segmentation and more.
              </p>
              <button className="text-sm text-primary">Browse Vision Models →</button>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Language Processing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Models for text generation, translation, summarization and understanding.
              </p>
              <button className="text-sm text-primary">Browse Language Models →</button>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Multimodal Intelligence</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Models that understand and generate across multiple data types.
              </p>
              <button className="text-sm text-primary">Browse Multimodal Models →</button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
