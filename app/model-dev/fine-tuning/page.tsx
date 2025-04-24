import { PageShell } from "@/components/page-shell"

export default function FineTuningPage() {
  return (
    <PageShell
      title="Fine-Tuning"
      description="Adapt pre-trained models to your specific use cases"
      tabs={[
        { title: "Overview", href: "/model-dev/fine-tuning" },
        { title: "Fine-Tuning Jobs", href: "/model-dev/fine-tuning/jobs" },
        { title: "Base Models", href: "/model-dev/fine-tuning/base-models" },
        { title: "Training Data", href: "/model-dev/fine-tuning/data" },
      ]}
    >
      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Model Fine-Tuning</h2>
          <p className="text-muted-foreground mb-4">
            Fine-tuning allows you to adapt pre-trained AI models to your specific domain and use cases. Start with
            powerful foundation models and customize them with your own data to achieve better performance for your
            unique requirements.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Transfer Learning</h3>
              <p className="text-sm text-muted-foreground">
                Leverage pre-trained models to reduce training time and data requirements.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Custom Adaptations</h3>
              <p className="text-sm text-muted-foreground">
                Adapt models to your specific domain terminology and use cases.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Low-Resource Tuning</h3>
              <p className="text-sm text-muted-foreground">Achieve high performance even with limited training data.</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
