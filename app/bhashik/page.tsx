import { PageShell } from "@/components/page-shell"
import { Languages, SearchCheck, FileText, Heart, ScrollText, Volume2, Mic, AudioLines } from "lucide-react"

const textServices = [
  {
    title: "Text Translation",
    description: "Translate written content between languages",
    icon: Languages
  },
  {
    title: "Language Detection", 
    description: "Detect the language present in the text",
    icon: SearchCheck
  },
  {
    title: "Extraction",
    description: "Extract the set of defined entities from the text", 
    icon: FileText
  },
  {
    title: "Sentiment Analysis",
    description: "Dominant sentiment detection for overall content and specific entity within",
    icon: Heart
  },
  {
    title: "Summarization",
    description: "Summarize the main points and essence of a text",
    icon: ScrollText
  }
]

const speechServices = [
  {
    title: "Text to Speech",
    description: "Transform written text into natural-sounding speech in multiple languages",
    icon: Volume2
  },
  {
    title: "Speech to Text", 
    description: "Precisely capture and transcribe audio into text, making it easy to record and analyse spoken content",
    icon: Mic
  },
  {
    title: "Speech to Speech",
    description: "Directly translate spoken language into another, enabling smooth conversations across languages",
    icon: AudioLines
  }
]

function ServiceCard({ title, description, icon: Icon }: { title: string; description: string; icon: any }) {
  return (
    <div 
      style={{
        borderRadius: '16px',
        border: '4px solid #FFF',
        background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
        boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
        padding: '1.5rem'
      }}
      className="h-full"
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function ServiceSection({ title, services }: { title: string; services: typeof textServices }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-normal">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            description={service.description}
            icon={service.icon}
          />
        ))}
      </div>
    </div>
  )
}

export default function BhashikPage() {
  return (
    <PageShell
      title="Bhashik"
      description="AI-powered language processing services for text and speech"
    >
      <div className="space-y-12">
        <ServiceSection 
          title="Text" 
          services={textServices}
        />
        <ServiceSection 
          title="Speech" 
          services={speechServices}
        />
      </div>
    </PageShell>
  )
} 