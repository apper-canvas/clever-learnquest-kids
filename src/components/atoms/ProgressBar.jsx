import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const ProgressBar = forwardRef(({ 
  className, 
  progress = 0,
  max = 100,
  showLabel = false,
  label,
  variant = "default",
  size = "default",
  animated = true,
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max((progress / max) * 100, 0), 100)
  
  const variants = {
    default: "bg-gradient-to-r from-primary to-secondary",
    success: "bg-gradient-to-r from-success to-green-500",
    warning: "bg-gradient-to-r from-warning to-orange-500",
    accent: "bg-gradient-to-r from-accent to-yellow-400"
  }
  
  const sizes = {
    sm: "h-2",
    default: "h-3",
    lg: "h-4"
  }
  
  return (
    <div className="space-y-2">
      {(showLabel || label) && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-body font-medium text-gray-700">
            {label || "Progress"}
          </span>
          <span className="text-sm font-body font-semibold text-gray-600">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-gray-200 rounded-full overflow-hidden",
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variants[variant],
            animated && "progress-fill"
          )}
          style={{ 
            width: `${percentage}%`,
            ...(animated && { "--progress": `${percentage}%` })
          }}
        />
      </div>
    </div>
  )
})

ProgressBar.displayName = "ProgressBar"

export default ProgressBar