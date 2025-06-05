interface StatusBadgeProps {
  status: string
}

/**
 * @component StatusBadge
 * @description Displays a colored badge indicating status
 * @status Active
 * @example
 * <StatusBadge status="active" />
 */
export function StatusBadge({ status }: StatusBadgeProps) {
  let bgColor = "bg-secondary"
  let textColor = "text-secondary-foreground"

  switch (status.toLowerCase()) {
    case "active":
    case "running":
    case "available":
    case "public":
    case "tcp":
      bgColor = "bg-green-100"
      textColor = "text-green-800"
      break
    case "pending":
    case "provisioning":
    case "updating":
      bgColor = "bg-yellow-100"
      textColor = "text-yellow-800"
      break
    case "inactive":
    case "stopped":
    case "error":
      bgColor = "bg-red-100"
      textColor = "text-red-800"
      break
    case "private":
      bgColor = "bg-blue-100"
      textColor = "text-blue-800"
      break
    case "udp":
      bgColor = "bg-purple-100"
      textColor = "text-purple-800"
      break
    case "icmp":
      bgColor = "bg-orange-100"
      textColor = "text-orange-800"
      break
    case "all":
      bgColor = "bg-secondary"
      textColor = "text-secondary-foreground"
      break
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status}
    </span>
  )
}
