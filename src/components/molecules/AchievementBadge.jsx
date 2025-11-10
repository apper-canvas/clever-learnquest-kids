import React from "react"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const AchievementBadge = ({ 
  achievement,
  size = "default",
  showDetails = true,
  className 
}) => {
  const badge = achievement?.badge
  if (!badge) return null
  
  const sizes = {
    sm: "w-12 h-12",
    default: "w-16 h-16",
    lg: "w-20 h-20"
  }
  
  const iconSizes = {
    sm: "w-6 h-6",
    default: "w-8 h-8", 
    lg: "w-10 h-10"
  }
  
  return (
    <div className={cn("text-center space-y-2", className)}>
      {/* Badge Icon */}
      <div className={cn(
        "mx-auto rounded-full flex items-center justify-center shadow-lift celebrate",
        sizes[size]
      )} style={{ backgroundColor: badge.color }}>
        <ApperIcon 
          name={badge.icon} 
          className={cn(iconSizes[size], "text-white")}
        />
      </div>
      
      {/* Badge Details */}
      {showDetails && (
        <div className="space-y-1">
          <h4 className="font-display font-bold text-gray-800 text-sm">
            {badge.name}
          </h4>
          <p className="font-body text-xs text-gray-600 leading-relaxed">
            {badge.description}
          </p>
        </div>
      )}
    </div>
  )
}

export default AchievementBadge