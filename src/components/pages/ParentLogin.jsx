import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import { setSettings } from "@/store/slices/parentSettingsSlice"
import parentSettingsService from "@/services/api/parentSettingsService"

const ParentLogin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (pin.length !== 4) {
      setError("PIN must be 4 digits")
      return
    }
    
    try {
      setIsSubmitting(true)
      setError("")
      
      const isValid = await parentSettingsService.validatePin(pin)
      
      if (isValid) {
        const settings = await parentSettingsService.get()
        dispatch(setSettings(settings))
        toast.success("Welcome to the parent dashboard! 👋")
        navigate("/parent/dashboard")
      } else {
        setError("Incorrect PIN. Please try again.")
        setPin("")
      }
      
    } catch (err) {
      setError("Failed to validate PIN. Please try again.")
      console.error("PIN validation error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setPin(value)
    if (error) setError("")
  }
  
  const handleBackToChild = () => {
    navigate("/")
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lift">
              <ApperIcon name="Shield" className="w-10 h-10 text-white" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-display font-bold text-gray-800">
                Parent Access
              </h1>
              <p className="text-gray-600 font-body">
                Enter your 4-digit PIN to access the parent dashboard
              </p>
            </div>
          </div>
          
          {/* PIN Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-body font-medium text-gray-700 text-center">
                Parent PIN
              </label>
              <Input
                type="password"
                value={pin}
                onChange={handlePinChange}
                placeholder="Enter 4-digit PIN"
                className="text-center text-2xl tracking-widest font-mono"
                error={error}
                maxLength={4}
              />
              {!error && pin.length > 0 && pin.length < 4 && (
                <p className="text-sm text-gray-500 text-center font-body">
                  Enter {4 - pin.length} more digit{4 - pin.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isSubmitting}
              disabled={pin.length !== 4}
              icon="ArrowRight"
              iconPosition="right"
            >
              Access Dashboard
            </Button>
          </form>
          
          {/* Info */}
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Info" className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700 font-body">
                  <p className="font-semibold mb-1">Default PIN: 1234</p>
                  <p>You can change this PIN in the dashboard settings for security.</p>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              onClick={handleBackToChild}
              className="w-full"
              icon="ArrowLeft"
            >
              Back to Kids Area
            </Button>
          </div>
          
          {/* Security Note */}
          <div className="text-center">
            <p className="text-xs text-gray-500 font-body">
              🔒 This area is protected to keep your child's learning data safe
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ParentLogin