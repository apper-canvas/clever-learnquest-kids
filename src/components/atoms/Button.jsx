import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const buttonVariants = {
  default: "bg-gradient-to-r from-primary to-secondary text-white shadow-lift hover:shadow-xl",
  secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-soft hover:shadow-lift",
  success: "bg-gradient-to-r from-success to-green-500 text-white shadow-lift hover:shadow-xl",
  warning: "bg-gradient-to-r from-warning to-orange-500 text-white shadow-lift hover:shadow-xl",
  error: "bg-gradient-to-r from-error to-pink-500 text-white shadow-lift hover:shadow-xl",
  ghost: "bg-transparent text-gray-600 hover:bg-gray-50",
  outline: "border-2 border-primary text-primary bg-white hover:bg-primary hover:text-white"
}

const buttonSizes = {
  sm: "px-4 py-2 text-sm rounded-xl",
  default: "px-6 py-3 text-base rounded-2xl",
  lg: "px-8 py-4 text-lg rounded-2xl",
  xl: "px-10 py-5 text-xl rounded-3xl"
}

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-body font-semibold transition-all duration-200 transform hover:scale-105 btn-bounce focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
  
  const renderIcon = () => {
    if (loading) {
      return <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
    }
    if (icon) {
      return <ApperIcon name={icon} className="w-4 h-4" />
    }
    return null
  }
  
  const iconElement = renderIcon()
  
  return (
    <button
      className={cn(
        baseClasses,
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {iconElement && iconPosition === "left" && (
        <span className={children ? "mr-2" : ""}>{iconElement}</span>
      )}
      {children}
      {iconElement && iconPosition === "right" && (
        <span className={children ? "ml-2" : ""}>{iconElement}</span>
      )}
    </button>
  )
})

Button.displayName = "Button"

export default Button