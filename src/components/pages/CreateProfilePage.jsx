import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Avatar from "@/components/atoms/Avatar"
import ApperIcon from "@/components/ApperIcon"
import { addProfile, setCurrentProfile } from "@/store/slices/childProfileSlice"
import childProfileService from "@/services/api/childProfileService"
import { cn } from "@/utils/cn"

const CreateProfilePage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    avatarId: "star",
    favoriteColor: "purple"
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const avatarOptions = [
    { id: "unicorn", label: "Magical Unicorn", icon: "Zap" },
    { id: "robot", label: "Friendly Robot", icon: "Bot" },
    { id: "dragon", label: "Happy Dragon", icon: "Flame" },
    { id: "star", label: "Shining Star", icon: "Star" },
    { id: "heart", label: "Kind Heart", icon: "Heart" },
    { id: "rocket", label: "Space Rocket", icon: "Rocket" }
  ]
  
  const colorOptions = [
    { id: "purple", label: "Purple", color: "bg-purple-400" },
    { id: "blue", label: "Blue", color: "bg-blue-400" },
    { id: "green", label: "Green", color: "bg-green-400" },
    { id: "pink", label: "Pink", color: "bg-pink-400" },
    { id: "yellow", label: "Yellow", color: "bg-yellow-400" },
    { id: "red", label: "Red", color: "bg-red-400" }
  ]
  
  const steps = [
    {
      title: "What's your name?",
      description: "Tell us what you'd like to be called!"
    },
    {
      title: "How old are you?",
      description: "This helps us pick the perfect games for you!"
    },
    {
      title: "Choose your character!",
      description: "Pick your favorite character to represent you!"
    },
    {
      title: "What's your favorite color?",
      description: "We'll use this to make your experience special!"
    }
  ]
  
  const validateStep = (step) => {
    const newErrors = {}
    
    switch(step) {
      case 0:
        if (!formData.name.trim()) {
          newErrors.name = "Please enter your name"
        } else if (formData.name.trim().length < 2) {
          newErrors.name = "Name must be at least 2 characters"
        }
        break
      case 1:
        const age = parseInt(formData.age)
        if (!formData.age || isNaN(age)) {
          newErrors.age = "Please enter your age"
        } else if (age < 4 || age > 10) {
          newErrors.age = "Age must be between 4 and 10"
        }
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    } else {
      navigate("/")
    }
  }
  
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      
      const profileData = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        avatarId: formData.avatarId,
        favoriteColor: formData.favoriteColor
      }
      
      const newProfile = await childProfileService.create(profileData)
      
      dispatch(addProfile(newProfile))
      dispatch(setCurrentProfile(newProfile))
      
      toast.success(`Welcome to LearnQuest, ${newProfile.name}! 🎉`)
      navigate("/")
      
    } catch (error) {
      toast.error("Failed to create profile. Please try again.")
      console.error("Profile creation error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-body text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-body text-gray-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
        
        <Card className="p-8 space-y-8">
          {/* Step Header */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-display font-bold text-gray-800">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600 font-body">
              {steps[currentStep].description}
            </p>
          </div>
          
          {/* Step Content */}
          <div className="space-y-6">
            {/* Step 0: Name */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <Input
                  label="Your Name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="Enter your name..."
                  error={errors.name}
                  required
                  className="text-center text-2xl font-display"
                />
              </div>
            )}
            
            {/* Step 1: Age */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <Input
                  label="Your Age"
                  type="number"
                  min="4"
                  max="10"
                  value={formData.age}
                  onChange={(e) => updateFormData("age", e.target.value)}
                  placeholder="How old are you?"
                  error={errors.age}
                  required
                  className="text-center text-2xl font-display"
                />
              </div>
            )}
            
            {/* Step 2: Avatar */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Avatar 
                    avatarId={formData.avatarId}
                    size="2xl"
                    className="mx-auto mb-4 mascot-bounce"
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {avatarOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => updateFormData("avatarId", option.id)}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all duration-200 transform hover:scale-105 text-center space-y-2",
                        formData.avatarId === option.id
                          ? "border-primary bg-primary/10 shadow-lift"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      )}
                    >
                      <Avatar 
                        avatarId={option.id}
                        size="lg"
                        className="mx-auto"
                      />
                      <div className="text-sm font-body font-medium text-gray-700">
                        {option.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Step 3: Favorite Color */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {colorOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => updateFormData("favoriteColor", option.id)}
                      className={cn(
                        "p-6 rounded-2xl border-2 transition-all duration-200 transform hover:scale-105 text-center space-y-3",
                        formData.favoriteColor === option.id
                          ? "border-primary bg-primary/10 shadow-lift"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-full mx-auto shadow-soft",
                        option.color
                      )} />
                      <div className="text-base font-body font-medium text-gray-700">
                        {option.label}
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Preview */}
                <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-display font-bold text-gray-800">
                      Profile Preview
                    </h3>
                    <div className="flex items-center justify-center space-x-4">
                      <Avatar 
                        avatarId={formData.avatarId}
                        size="xl"
                      />
                      <div className="text-left">
                        <div className="text-xl font-display font-bold text-gray-800">
                          {formData.name}
                        </div>
                        <div className="text-gray-600 font-body">
                          Age {formData.age}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className={cn(
                            "w-4 h-4 rounded-full",
                            colorOptions.find(c => c.id === formData.favoriteColor)?.color
                          )} />
                          <span className="text-sm text-gray-600 font-body capitalize">
                            {formData.favoriteColor}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              variant="secondary"
              onClick={handleBack}
              icon="ArrowLeft"
            >
              {currentStep === 0 ? "Cancel" : "Back"}
            </Button>
            
            <Button
              onClick={handleNext}
              loading={isSubmitting}
              icon={currentStep === steps.length - 1 ? "Check" : "ArrowRight"}
              iconPosition="right"
            >
              {currentStep === steps.length - 1 ? "Create Profile" : "Next"}
            </Button>
          </div>
        </Card>
        
        {/* Fun Encouragement */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 font-body flex items-center justify-center">
            <ApperIcon name="Sparkles" className="w-4 h-4 mr-2 text-yellow-400" />
            You're creating something amazing! 
            <ApperIcon name="Heart" className="w-4 h-4 ml-2 text-red-400" />
          </p>
        </div>
      </div>
    </div>
  )
}

export default CreateProfilePage