import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const languageModels = [
  {
    name: "Text Generation GPT",
    description: "Advanced language model for natural text generation and completion",
    type: "Generation",
    parameters: "1.5B",
    languages: "12+",
    framework: "PyTorch",
  },
  {
    name: "Translation Master",
    description: "Neural machine translation model supporting 100+ language pairs",
    type: "Translation",
    parameters: "800M",
    languages: "100+",
    framework: "TensorFlow",
  },
  {
    name: "Sentiment Analyzer",
    description: "Robust sentiment analysis model for multiple languages and domains",
    type: "Classification",
    parameters: "350M",
    languages: "8+",
    framework: "PyTorch",
  },
]

export default function LanguageModelsPage() {
  return (
    <PageShell
      title="Language Models"
      description="Explore our collection of natural language processing models"
      tabs={[
        { title: "All Models", href: "/model-hub/catalog" },
        { title: "Vision Models", href: "/model-hub/catalog/vision" },
        { title: "Language Models", href: "/model-hub/catalog/language" },
        { title: "Multimodal Models", href: "/model-hub/catalog/multimodal" },
      ]}
    >
      <div className="grid gap-6">
        {languageModels.map((model, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{model.name}</CardTitle>
                <Badge variant="outline">{model.type}</Badge>
              </div>
              <CardDescription>{model.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Parameters</p>
                  <p className="font-medium">{model.parameters}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Languages</p>
                  <p className="font-medium">{model.languages}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Framework</p>
                  <p className="font-medium">{model.framework}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  )
} 