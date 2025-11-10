import React from "react"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const GameCard = ({ 
  game, 
  progress, 
  onClick,
  worldColor = "primary",
  className 
}) => {
  const starsEarned = progress?.starsEarned || 0
  const difficultyLevel = progress?.difficultyLevel || 1
  const hasPlayed = progress && progress.attemptsCount > 0
  
  const getDifficultyColor = (level) => {
    switch(level) {
      case 1: return "success"
      case 2: return "warning" 
      case 3: return "error"
      default: return "success"
    }
  }
  
  const getDifficultyLabel = (level) => {
    switch(level) {
      case 1: return "Easy"
      case 2: return "Medium"
      case 3: return "Hard"
      default: return "Easy"
    }
  }
  
  return (
    <Card
      variant="world"
      interactive
      onClick={onClick}
      className={cn("game-card group cursor-pointer", className)}
    >
      <div className="p-6 space-y-4">
        {/* Game Icon & Title */}
        <div className="flex items-center space-x-4">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-soft group-hover:shadow-lift transition-all duration-300",
            worldColor === "math" ? "from-primary/20 to-pink-100" : "from-secondary/20 to-teal-100"
          )}>
            <ApperIcon 
              name={game.icon} 
              className={cn(
                "w-8 h-8",
                worldColor === "math" ? "text-primary" : "text-secondary"
              )}
            />
          </div>
          
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-display font-bold text-gray-800 group-hover:text-primary transition-colors">
              {game.name}
            </h3>
            <p className="text-sm text-gray-600 font-body">
              Ages {game.ageRange}
            </p>
          </div>
        </div>
        
        {/* Game Description */}
        <p className="text-gray-600 font-body text-sm leading-relaxed">
          {game.description}
        </p>
        
        {/* Progress & Stats */}
        <div className="space-y-3">
          {/* Stars Earned */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-gray-700">Stars Earned:</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3].map((star) => (
                <ApperIcon 
                  key={star}
                  name="Star" 
                  className={cn(
                    "w-5 h-5",
                    star <= starsEarned 
                      ? "text-accent fill-accent sparkle" 
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
          </div>
          
          {/* Difficulty Level */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-gray-700">Difficulty:</span>
            <Badge 
              variant={getDifficultyColor(difficultyLevel)} 
              size="sm"
            >
              {getDifficultyLabel(difficultyLevel)}
            </Badge>
          </div>
          
          {/* Play Status */}
          {hasPlayed && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-gray-700">Best Score:</span>
              <span className="text-sm font-body font-semibold text-gray-800">
                {progress.highScore}%
              </span>
            </div>
          )}
        </div>
        
        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2">
          {game.skills.slice(0, 3).map((skill) => (
            <Badge 
              key={skill} 
              variant="secondary" 
              size="sm"
              className="capitalize"
            >
              {skill}
            </Badge>
          ))}
        </div>
        
        {/* Play Button */}
        <div className="pt-2">
          <div className={cn(
            "w-full py-3 rounded-xl font-body font-semibold text-center transition-all duration-200 group-hover:scale-105",
            hasPlayed 
              ? "bg-gradient-to-r from-success to-green-500 text-white" 
              : "bg-gradient-to-r from-primary to-secondary text-white"
          )}>
            <div className="flex items-center justify-center space-x-2">
              <ApperIcon 
                name={hasPlayed ? "RotateCcw" : "Play"} 
                className="w-4 h-4" 
              />
              <span>{hasPlayed ? "Play Again" : "Start Playing"}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default GameCard