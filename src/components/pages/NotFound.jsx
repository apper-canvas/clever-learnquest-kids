import React from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const NotFound = () => {
  const navigate = useNavigate()
  
  const handleGoHome = () => {
    navigate("/")
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        {/* Confused Mascot */}
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-soft">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <ApperIcon name="Search" className="w-12 h-12 text-gray-400" />
            </div>
          </div>
          
          {/* Floating question marks */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-warning rounded-full flex items-center justify-center text-white font-bold">
            ?
          </div>
          <div className="absolute top-8 -left-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
            ?
          </div>
        </div>
        
        {/* Error Message */}
        <div className="space-y-3">
          <div className="text-6xl font-display font-bold text-gray-800">
            404
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-800">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 font-body leading-relaxed">
            This page seems to have gone on an adventure without us! 
            Let's get you back to the fun learning games.
          </p>
        </div>
        
        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={handleGoHome}
            icon="Home"
            size="lg"
            className="w-full"
          >
            Go Home
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            icon="ArrowLeft"
            className="w-full"
          >
            Go Back
          </Button>
        </div>
        
        {/* Fun encouragement */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
          <p className="text-sm text-blue-600 font-body flex items-center justify-center">
            <ApperIcon name="Sparkles" className="w-4 h-4 mr-2 text-accent" />
            Don't worry! Even the best explorers take wrong turns sometimes! 
            <ApperIcon name="Smile" className="w-4 h-4 ml-2 text-green-400" />
          </p>
        </div>
      </Card>
    </div>
  )
}

export default NotFound