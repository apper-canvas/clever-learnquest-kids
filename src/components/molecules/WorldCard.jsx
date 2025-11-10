import React from "react"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const WorldCard = ({ 
  world, 
  totalGames, 
  completedGames, 
  totalStars, 
  onClick,
  className 
}) => {
  const progressPercentage = totalGames > 0 ? (completedGames / totalGames) * 100 : 0
  
  const mascotIcons = {
    "NumberBot": "Bot",
    "WiseOwl": "Owl"
  }
  
  return (
    <Card
      variant="world"
      interactive
      onClick={onClick}
      className={cn("world-card group cursor-pointer overflow-hidden", className)}
    >
      <div className="relative">
        {/* Background gradient */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-10",
          world.worldId === "math" 
            ? "from-primary to-pink-400" 
            : "from-secondary to-teal-400"
        )} />
        
        <div className="relative p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* World Mascot */}
              <div className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center shadow-lift group-hover:shadow-xl transition-all duration-300 mascot-bounce",
                world.worldId === "math"
                  ? "bg-gradient-to-br from-primary to-pink-400"
                  : "bg-gradient-to-br from-secondary to-teal-400"
              )}>
                <ApperIcon 
                  name={mascotIcons[world.mascot] || "Smile"} 
                  className="w-10 h-10 text-white drop-shadow-sm" 
                />
              </div>
              
              <div className="space-y-1">
                <h2 className="text-2xl font-display font-bold text-gray-800 group-hover:text-primary transition-colors">
                  {world.name}
                </h2>
                <p className="text-gray-600 font-body">
                  {world.description}
                </p>
              </div>
            </div>
            
            {/* Enter Arrow */}
            <div className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center group-hover:scale-110 transition-transform">
              <ApperIcon name="ArrowRight" className="w-6 h-6 text-gray-700" />
            </div>
          </div>
          
          {/* Progress Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-white rounded-xl shadow-soft mx-auto flex items-center justify-center">
                <ApperIcon name="Target" className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-gray-800">
                  {completedGames}
                </p>
                <p className="text-xs text-gray-600 font-body">
                  Games Played
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-white rounded-xl shadow-soft mx-auto flex items-center justify-center">
                <ApperIcon name="Star" className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-gray-800">
                  {totalStars}
                </p>
                <p className="text-xs text-gray-600 font-body">
                  Stars Earned
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-white rounded-xl shadow-soft mx-auto flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-gray-800">
                  {Math.round(progressPercentage)}%
                </p>
                <p className="text-xs text-gray-600 font-body">
                  Progress
                </p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-body">
              <span className="text-gray-700">World Progress</span>
              <span className="text-gray-600">{completedGames} of {totalGames} games</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-out",
                  world.worldId === "math"
                    ? "bg-gradient-to-r from-primary to-pink-400"
                    : "bg-gradient-to-r from-secondary to-teal-400"
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="pt-4">
            <div className={cn(
              "w-full py-4 rounded-2xl font-body font-semibold text-center text-white transition-all duration-200 group-hover:scale-105 shadow-soft group-hover:shadow-lift",
              world.worldId === "math"
                ? "bg-gradient-to-r from-primary to-pink-400"
                : "bg-gradient-to-r from-secondary to-teal-400"
            )}>
              <div className="flex items-center justify-center space-x-2">
                <ApperIcon name="Play" className="w-5 h-5" />
                <span>Enter {world.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default WorldCard