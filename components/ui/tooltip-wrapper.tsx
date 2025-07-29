"use client"

import React from "react"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "./tooltip"

interface TooltipWrapperProps {
  children: React.ReactNode
  content: string | React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  delayDuration?: number
  disabled?: boolean
}

export function TooltipWrapper({ 
  children, 
  content, 
  side = "top", 
  align = "center",
  delayDuration = 300,
  disabled = false
}: TooltipWrapperProps) {
  if (disabled) {
    return <>{children}</>
  }

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          avoidCollisions={true}
          collisionPadding={20}
          sticky="always"
          className="max-w-xs"
        >
          {typeof content === 'string' ? <p className="whitespace-normal">{content}</p> : content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 