import { useState, useEffect } from "react"
import { TooltipWrapper } from "./ui/tooltip-wrapper"
import { Progress } from "./ui/progress"
import { Clock } from "lucide-react"

interface VPCDeletionStatusProps {
  vpc: {
    id: string
    name: string
    status: string
    deletionStartedOn?: string
    estimatedDeletionTime?: number // in minutes
  }
  showProgress?: boolean
  compact?: boolean
}

export function VPCDeletionStatus({ vpc, showProgress = true, compact = false }: VPCDeletionStatusProps) {
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (vpc.status !== "deleting" || !vpc.deletionStartedOn) return

    const updateProgress = () => {
      const deletionStarted = new Date(vpc.deletionStartedOn!).getTime()
      const now = new Date().getTime()
      const elapsed = Math.floor((now - deletionStarted) / 1000 / 60) // minutes elapsed
      const estimatedTotal = vpc.estimatedDeletionTime || 15
      
      setTimeElapsed(elapsed)
      
      // Calculate progress (max 95% until actually complete)
      const calculatedProgress = Math.min((elapsed / estimatedTotal) * 100, 95)
      setProgress(calculatedProgress)
    }

    updateProgress()
    const interval = setInterval(updateProgress, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [vpc.deletionStartedOn, vpc.estimatedDeletionTime, vpc.status])

  if (vpc.status !== "deleting") {
    return null
  }

  const formatTimeRemaining = () => {
    const estimatedTotal = vpc.estimatedDeletionTime || 15
    const remaining = Math.max(0, estimatedTotal - timeElapsed)
    if (remaining === 0) return "Completing..."
    return `~${remaining} min remaining`
  }

  const AnimatedDots = () => (
    <div className="flex items-center gap-0.5">
      <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
      <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  )

  if (compact) {
    return (
      <TooltipWrapper 
        content={`VPC deletion in progress. Started ${timeElapsed} minutes ago. ${formatTimeRemaining()}`}
      >
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <AnimatedDots />
          Deleting
        </span>
      </TooltipWrapper>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <span className="text-sm font-medium text-blue-800">VPC Deletion in Progress</span>
      </div>
      
              {showProgress && (
          <>
            <div className="space-y-2">
              <Progress value={progress} className="h-2 bg-blue-100" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeElapsed} min elapsed
                </span>
                <span>{formatTimeRemaining()}</span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="font-medium text-blue-800 mb-1">Deletion Process:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Terminating all resources</li>
                <li>• Releasing IP addresses</li>
                <li>• Cleaning up network configurations</li>
                <li>• Removing security groups</li>
                <li>• Final cleanup and verification</li>
              </ul>
            </div>
          </>
        )}
    </div>
  )
} 