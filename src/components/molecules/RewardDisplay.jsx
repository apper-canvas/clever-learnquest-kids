import React from "react"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const RewardDisplay = ({ 
  stars, 
  coins, 
  showLabels = true,
  size = "default",
  className 
}) => {
  const sizes = {
    sm: { icon: "w-4 h-4", text: "text-sm" },
    default: { icon: "w-5 h-5", text: "text-base" },
    lg: { icon: "w-6 h-6", text: "text-lg" }
  }
  
  return (
    <div className={cn("flex items-center space-x-4", className)}>
      {/* Stars */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <ApperIcon 
            name="Star" 
            className={cn(
              sizes[size].icon,
              "text-accent fill-accent sparkle"
            )} 
          />
        </div>
        <span className={cn(
          "font-body font-bold text-gray-800",
          sizes[size].text
        )}>
          {stars || 0}
        </span>
        {showLabels && (
          <span className={cn(
            "font-body text-gray-600",
            size === "sm" ? "text-xs" : "text-sm"
          )}>
            stars
          </span>
        )}
      </div>
      
      {/* Coins */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <ApperIcon 
            name="Coins" 
            className={cn(
              sizes[size].icon,
              "text-warning"
            )} 
          />
        </div>
        <span className={cn(
          "font-body font-bold text-gray-800",
          sizes[size].text
        )}>
          {coins || 0}
        </span>
        {showLabels && (
          <span className={cn(
            "font-body text-gray-600",
            size === "sm" ? "text-xs" : "text-sm"
          )}>
            coins
          </span>
        )}
      </div>
    </div>
  )
}

export default RewardDisplay