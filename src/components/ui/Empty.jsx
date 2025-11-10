import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "Nothing here yet!", 
  description = "But that's okay - every adventure starts somewhere!",
  actionText = "Let's get started!",
  onAction,
  icon = "Smile",
  showAction = true
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center max-w-md mx-auto space-y-6">
        {/* Friendly Mascot */}
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-soft">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <ApperIcon name={icon} className="w-12 h-12 text-secondary" />
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center sparkle">
            <ApperIcon name="Star" className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -bottom-1 -left-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center sparkle" style={{ animationDelay: "0.5s" }}>
            <ApperIcon name="Heart" className="w-3 h-3 text-white" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-display font-bold text-gray-800">
            {title}
          </h3>
          <p className="text-gray-600 font-body leading-relaxed">
            {description}
          </p>
        </div>
        
        {showAction && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-2xl font-body font-semibold text-lg shadow-lift hover:shadow-xl transform hover:scale-105 transition-all duration-200 btn-bounce"
          >
            <ApperIcon name="Play" className="w-5 h-5" />
            <span>{actionText}</span>
          </button>
        )}
        
        {/* Encouraging message */}
        <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-100">
          <p className="text-sm text-green-600 font-body flex items-center justify-center">
            <ApperIcon name="Sparkles" className="w-4 h-4 mr-2 text-accent" />
            Every great learner started just like you!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Empty