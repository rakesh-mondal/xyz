import { PageShell } from "@/components/page-shell"

export default function ModelEvaluationPage() {
  return (
    <PageShell
      title="Model Evaluation"
      description="Evaluate and benchmark AI model performance"
      tabs={[
        { title: "Overview", href: "/model-dev/evaluation" },
        { title: "Metrics", href: "/model-dev/evaluation/metrics" },
        { title: "Benchmarks", href: "/model-dev/evaluation/benchmarks" },
        { title: "Comparative Analysis", href: "/model-dev/evaluation/comparative" },
      ]}
    >
      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">AI Model Evaluation</h2>
          <p className="text-muted-foreground mb-4">
            Comprehensive tools and metrics to evaluate the performance of your AI models. Compare different models,
            track improvements over time, and ensure your models meet quality standards before deployment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Performance Metrics</h3>
              <p className="text-sm text-muted-foreground">
                Measure accuracy, precision, recall, F1 score, and other key metrics.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Error Analysis</h3>
              <p className="text-sm text-muted-foreground">Identify and understand model errors and failure cases.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Automated Testing</h3>
              <p className="text-sm text-muted-foreground">Run automated test suites to validate model behavior.</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
