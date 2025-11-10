import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const avatarSizes = {
  sm: "w-8 h-8",
  default: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
  "2xl": "w-32 h-32"
}

const avatarData = {
  unicorn: { icon: "Zap", color: "from-purple-400 to-pink-400" },
  robot: { icon: "Bot", color: "from-blue-400 to-cyan-400" },
  dragon: { icon: "Flame", color: "from-green-400 to-emerald-400" },
  star: { icon: "Star", color: "from-yellow-400 to-orange-400" },
  heart: { icon: "Heart", color: "from-red-400 to-pink-400" },
  rocket: { icon: "Rocket", color: "from-indigo-400 to-purple-400" }
}

const Avatar = forwardRef(({ 
  className, 
  size = "default",
  avatarId = "star",
  name,
  showBorder = true,
  ...props 
}, ref) => {
  const avatar = avatarData[avatarId] || avatarData.star
  const borderClasses = showBorder ? "border-4 border-white shadow-lift" : ""
  
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br flex items-center justify-center",
        avatar.color,
        avatarSizes[size],
        borderClasses,
        className
      )}
      ref={ref}
      title={name}
      {...props}
    >
      <ApperIcon 
        name={avatar.icon} 
        className="w-1/2 h-1/2 text-white drop-shadow-sm" 
      />
    </div>
  )
})

Avatar.displayName = "Avatar"

export default Avatar