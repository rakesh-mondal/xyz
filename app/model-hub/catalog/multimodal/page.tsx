import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const multimodalModels = [
  {
    name: "Vision-Language GPT",
    description: "Combined vision and language model for image understanding and text generation",
    type: "Vision-Language",
    modalities: "Image, Text",
    performance: "89.5%",
    framework: "PyTorch",
  },
  {
    name: "Audio-Visual Transformer",
    description: "Joint audio-visual processing for enhanced multimedia understanding",
    type: "Audio-Visual",
    modalities: "Audio, Video",
    performance: "92.1%",
    framework: "TensorFlow",
  },
  {
    name: "Multi-Sensor Fusion",
    description: "Advanced sensor fusion model for robotics and autonomous systems",
    type: "Sensor Fusion",
    modalities: "Image, Lidar, IMU",
    performance: "94.3%",
    framework: "PyTorch",
  },
]

export default function MultimodalModelsPage() {
  return (
    <PageShell
      title="Multimodal Models"
      description="Explore our collection of multimodal AI models"
      tabs={[
        { title: "All Models", href: "/model-hub/catalog" },
        { title: "Vision Models", href: "/model-hub/catalog/vision" },
        { title: "Language Models", href: "/model-hub/catalog/language" },
        { title: "Multimodal Models", href: "/model-hub/catalog/multimodal" },
      ]}
    >
      <div className="grid gap-6">
        {multimodalModels.map((model, index) => (
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
                  <p className="text-muted-foreground">Modalities</p>
                  <p className="font-medium">{model.modalities}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Performance</p>
                  <p className="font-medium">{model.performance}</p>
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