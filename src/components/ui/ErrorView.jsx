import React from "react"
import ApperIcon from "@/components/ApperIcon"

const ErrorView = ({ 
  error = "Something went wrong!", 
  onRetry, 
  retryText = "Try Again",
  showMascot = true 
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center max-w-md mx-auto space-y-6">
        {showMascot && (
          <div className="relative">
            {/* Sad Mascot */}
            <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-soft">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <ApperIcon name="Frown" className="w-12 h-12 text-orange-400" />
              </div>
            </div>
            
            {/* Floating question marks */}
            <div className="absolute -top-1 -right-2 w-6 h-6 bg-warning rounded-full flex items-center justify-center text-white font-bold text-sm">?</div>
            <div className="absolute top-8 -left-4 w-4 h-4 bg-error rounded-full flex items-center justify-center text-white font-bold text-xs">!</div>
          </div>
        )}
        
        <div className="space-y-3">
          <h3 className="text-2xl font-display font-bold text-gray-800">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 font-body leading-relaxed">
            {error}
          </p>
          <p className="text-sm text-gray-500 font-body">
            Don't worry, let's try that again!
          </p>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-2xl font-body font-semibold text-lg shadow-lift hover:shadow-xl transform hover:scale-105 transition-all duration-200 btn-bounce"
          >
            <ApperIcon name="RotateCcw" className="w-5 h-5" />
            <span>{retryText}</span>
          </button>
        )}
        
        {/* Encouraging message */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
          <p className="text-sm text-blue-600 font-body">
            <ApperIcon name="Heart" className="w-4 h-4 inline mr-2 text-red-400" />
            You're doing great! Sometimes things need a second try.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ErrorView