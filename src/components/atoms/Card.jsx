import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const cardVariants = {
  default: "bg-white border border-gray-200 shadow-soft",
  elevated: "bg-white border border-gray-100 shadow-lift",
  gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-soft",
  world: "bg-gradient-to-br from-white via-white to-gray-50 border-2 shadow-lift hover:shadow-xl world-card"
}

const Card = forwardRef(({ 
  className, 
  variant = "default",
  interactive = false,
  children, 
  ...props 
}, ref) => {
  const baseClasses = "rounded-2xl transition-all duration-300"
  const interactiveClasses = interactive ? "cursor-pointer hover:scale-[1.02] transform" : ""
  
  return (
    <div
      className={cn(
        baseClasses,
        cardVariants[variant],
        interactiveClasses,
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card