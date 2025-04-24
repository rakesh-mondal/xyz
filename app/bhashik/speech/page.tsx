import { PageShell } from "@/components/page-shell"

export default function BhashikSpeechPage() {
  return (
    <PageShell
      title="Speech Services"
      description="Advanced speech recognition and synthesis services powered by Bhashik AI"
      tabs={[
        { title: "Overview", href: "/bhashik/speech" },
        { title: "Speech to Text", href: "/bhashik/speech/recognition" },
        { title: "Text to Speech", href: "/bhashik/speech/synthesis" },
        { title: "Voice Identification", href: "/bhashik/speech/voice-id" },
      ]}
    >
      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Speech Technologies</h2>
          <p className="text-muted-foreground mb-4">
            Bhashik's speech services provide cutting-edge speech recognition and synthesis capabilities with support
            for multiple Indian languages and dialects. Our models are optimized for accuracy, speed, and
            natural-sounding output.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Speech Recognition</h3>
              <p className="text-sm text-muted-foreground">
                Convert spoken language into written text with high precision.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Speech Synthesis</h3>
              <p className="text-sm text-muted-foreground">
                Generate natural-sounding speech from text in multiple voices and languages.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Voice Identification</h3>
              <p className="text-sm text-muted-foreground">
                Identify and authenticate speakers based on their unique voice characteristics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
