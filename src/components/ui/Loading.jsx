import React from "react"

const Loading = ({ message = "Loading amazing games..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="text-center space-y-6">
        {/* Animated Mascot */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mascot-bounce flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Sparkles around mascot */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full sparkle"></div>
          <div className="absolute -bottom-1 -left-3 w-3 h-3 bg-secondary rounded-full sparkle" style={{ animationDelay: "0.5s" }}></div>
          <div className="absolute top-6 -right-4 w-2 h-2 bg-primary rounded-full sparkle" style={{ animationDelay: "1s" }}></div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-gray-800">{message}</h2>
          <p className="text-gray-600 font-body">Getting everything ready for you!</p>
        </div>
        
        {/* Progress Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  )
}

export default Loading