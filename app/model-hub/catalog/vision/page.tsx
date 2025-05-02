import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const visionModels = [
  {
    name: "Object Detection Pro",
    description: "High-performance object detection model with support for 80+ object classes",
    type: "Detection",
    accuracy: "93.5%",
    latency: "45ms",
    framework: "PyTorch",
  },
  {
    name: "Image Segmentation X",
    description: "Advanced semantic segmentation for precise object boundaries and scene understanding",
    type: "Segmentation",
    accuracy: "91.2%",
    latency: "65ms",
    framework: "TensorFlow",
  },
  {
    name: "Face Recognition Plus",
    description: "State-of-the-art face detection and recognition with emotion analysis",
    type: "Recognition",
    accuracy: "95.8%",
    latency: "35ms",
    framework: "PyTorch",
  },
]

export default function VisionModelsPage() {
  return (
    <PageShell
      title="Vision Models"
      description="Explore our collection of computer vision models"
      tabs={[
        { title: "All Models", href: "/model-hub/catalog" },
        { title: "Vision Models", href: "/model-hub/catalog/vision" },
        { title: "Language Models", href: "/model-hub/catalog/language" },
        { title: "Multimodal Models", href: "/model-hub/catalog/multimodal" },
      ]}
    >
      <div className="grid gap-6">
        {visionModels.map((model, index) => (
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
                  <p className="text-muted-foreground">Accuracy</p>
                  <p className="font-medium">{model.accuracy}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Latency</p>
                  <p className="font-medium">{model.latency}</p>
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