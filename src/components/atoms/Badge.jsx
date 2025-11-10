import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const badgeVariants = {
  default: "bg-gray-100 text-gray-800",
  primary: "bg-gradient-to-r from-primary to-pink-500 text-white",
  secondary: "bg-gradient-to-r from-secondary to-teal-500 text-white", 
  success: "bg-gradient-to-r from-success to-green-500 text-white",
  warning: "bg-gradient-to-r from-warning to-orange-500 text-white",
  error: "bg-gradient-to-r from-error to-red-500 text-white",
  accent: "bg-gradient-to-r from-accent to-yellow-400 text-gray-800"
}

const badgeSizes = {
  sm: "px-2 py-1 text-xs",
  default: "px-3 py-1 text-sm",
  lg: "px-4 py-2 text-base"
}

const Badge = forwardRef(({ 
  className, 
  variant = "default",
  size = "default",
  children, 
  ...props 
}, ref) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-body font-medium shadow-soft",
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = "Badge"

export default Badge