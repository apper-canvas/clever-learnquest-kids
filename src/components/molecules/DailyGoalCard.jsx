import React from "react"
import Card from "@/components/atoms/Card"
import ProgressBar from "@/components/atoms/ProgressBar"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const DailyGoalCard = ({ 
  dailyGoals, 
  onGameClick,
  className 
}) => {
  const completedCount = dailyGoals?.completedGames?.length || 0
  const totalCount = dailyGoals?.recommendedGames?.length || 0
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  
  return (
    <Card 
      variant="gradient"
      className={cn("p-6 space-y-4", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-yellow-100 rounded-xl flex items-center justify-center">
            <ApperIcon name="Target" className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-gray-800">
              Daily Goals
            </h3>
            <p className="text-sm text-gray-600 font-body">
              Complete 3 games today!
            </p>
          </div>
        </div>
        
        {dailyGoals?.isComplete && (
          <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center celebrate">
            <ApperIcon name="Check" className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      
      {/* Progress */}
      <ProgressBar
        progress={completedCount}
        max={totalCount}
        variant="accent"
        showLabel
        label={`Progress (${completedCount}/${totalCount})`}
      />
      
      {/* Recommended Games */}
      {dailyGoals?.recommendedGames && (
        <div className="space-y-3">
          <h4 className="text-sm font-body font-semibold text-gray-700">
            Today's Games:
          </h4>
          <div className="space-y-2">
            {dailyGoals.recommendedGames.map((gameId, index) => {
              const isCompleted = dailyGoals.completedGames.includes(gameId)
              
              return (
                <div
                  key={gameId}
                  onClick={() => onGameClick(gameId)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02]",
                    isCompleted 
                      ? "bg-success/10 border border-success/20" 
                      : "bg-white border border-gray-200 hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      isCompleted 
                        ? "bg-success text-white" 
                        : "bg-gray-100 text-gray-600"
                    )}>
                      {isCompleted ? (
                        <ApperIcon name="Check" className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <span className={cn(
                      "text-sm font-body capitalize",
                      isCompleted ? "text-success font-semibold" : "text-gray-700"
                    )}>
                      {gameId.replace("-", " ")}
                    </span>
                  </div>
                  
                  <ApperIcon 
                    name="Play" 
                    className={cn(
                      "w-4 h-4",
                      isCompleted ? "text-success" : "text-gray-400"
                    )} 
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
      
      {/* Encouragement */}
      {!dailyGoals?.isComplete && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-600 font-body flex items-center">
            <ApperIcon name="Sparkles" className="w-4 h-4 mr-2 text-accent" />
            You're doing amazing! Keep learning and having fun!
          </p>
        </div>
      )}
    </Card>
  )
}

export default DailyGoalCard