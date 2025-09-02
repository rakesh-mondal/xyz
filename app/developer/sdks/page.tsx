import { PageShell } from "@/components/page-shell"
import { SdkFeatureCard } from "@/components/ui/sdk-feature-card"
import { ComputeIcon } from "@/components/icons/compute-icon"
import { AiPodsIcon } from "@/components/icons/ai-pods-icon"
import { AiSolutionsIcon } from "@/components/icons/ai-solutions-icon"

const sdkSections = [
  {
    title: "Core Infrastructure",
    description: "Build and manage cloud infrastructure with our comprehensive SDK for virtual machines, storage, networking, and compute resources. Get started with powerful APIs that simplify complex infrastructure management tasks.",
    icon: <ComputeIcon className="text-blue-600" />,
    gradient: "from-blue-500/10 to-cyan-500/10",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop&crop=center"
  },
  {
    title: "AI Studio",
    description: "Accelerate AI development with our model training, fine-tuning, and deployment SDK for machine learning workflows. Build intelligent applications with cutting-edge machine learning capabilities.",
    icon: <AiPodsIcon className="text-purple-600" />,
    gradient: "from-purple-500/10 to-pink-500/10", 
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop&crop=center"
  },
  {
    title: "AI Saas",
    description: "Integrate ready-to-use AI services including language models, computer vision, speech processing, and document intelligence. Transform your applications with pre-trained AI capabilities.",
    icon: <AiSolutionsIcon className="text-green-600" />,
    gradient: "from-green-500/10 to-emerald-500/10",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop&crop=center"
  }
]

export default function SdksPage() {
  return (
    <PageShell
      title="SDKs & Libraries"
      description="Accelerate your development with our comprehensive SDKs. Build powerful applications using our infrastructure, AI models, and intelligent services with simple, well-documented APIs."
    >


      {/* SDK Feature Cards */}
      <div className="space-y-0">
        {sdkSections.map((sdk, index) => (
          <SdkFeatureCard
            key={index}
            title={sdk.title}
            description={sdk.description}
            icon={sdk.icon}
            gradient={sdk.gradient}
            imageUrl={sdk.imageUrl}
            reverse={index % 2 === 1} // Alternate layout: left image, right text
          />
        ))}
      </div>
    </PageShell>
  )
}
