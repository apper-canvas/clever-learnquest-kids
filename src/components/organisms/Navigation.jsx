import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import ApperIcon from "@/components/ApperIcon"
import Avatar from "@/components/atoms/Avatar"
import RewardDisplay from "@/components/molecules/RewardDisplay"
import { cn } from "@/utils/cn"

const Navigation = ({ className }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentProfile } = useSelector(state => state.childProfile)
  
  const navItems = [
    { 
      id: "home", 
      label: "Home", 
      icon: "Home", 
      path: "/" 
    },
    { 
      id: "profile", 
      label: "Profile", 
      icon: "User", 
      path: "/profile" 
    },
    { 
      id: "parent", 
      label: "Parents", 
      icon: "Shield", 
      path: "/parent" 
    }
  ]
  
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
    return false
  }
  
  return (
    <nav className={cn("bg-white border-t border-gray-200 lg:border-t-0 lg:border-r", className)}>
      {/* Desktop Header */}
      <div className="hidden lg:block p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-soft">
            <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-gray-800">
              LearnQuest
            </h1>
            <p className="text-xs text-gray-600 font-body">
              Kids Learning
            </p>
          </div>
        </div>
      </div>
      
      {/* Current Profile (Desktop) */}
      {currentProfile && (
        <div className="hidden lg:block p-6 border-b border-gray-100">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar 
                avatarId={currentProfile.avatarId}
                name={currentProfile.name}
                size="lg"
              />
              <div>
                <h3 className="font-display font-bold text-gray-800">
                  {currentProfile.name}
                </h3>
                <p className="text-sm text-gray-600 font-body">
                  Age {currentProfile.age}
                </p>
              </div>
            </div>
            
            <RewardDisplay 
              stars={currentProfile.totalStars}
              coins={currentProfile.totalCoins}
              size="sm"
              showLabels={false}
            />
          </div>
        </div>
      )}
      
      {/* Navigation Items */}
      <div className="flex lg:flex-col lg:p-6 lg:space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex-1 lg:flex-none flex lg:flex-row flex-col items-center justify-center lg:justify-start space-y-1 lg:space-y-0 lg:space-x-3 p-4 lg:p-3 lg:rounded-xl transition-all duration-200 font-body",
              isActive(item.path)
                ? "text-primary bg-primary/10 lg:bg-primary/10"
                : "text-gray-600 hover:text-primary hover:bg-gray-50"
            )}
          >
            <ApperIcon 
              name={item.icon} 
              className={cn(
                "w-6 h-6 lg:w-5 lg:h-5",
                isActive(item.path) ? "text-primary" : ""
              )} 
            />
            <span className={cn(
              "text-xs lg:text-sm font-medium",
              isActive(item.path) ? "text-primary font-semibold" : ""
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
      
      {/* Desktop Footer */}
      <div className="hidden lg:block mt-auto p-6 border-t border-gray-100">
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500 font-body">
            Safe & Fun Learning
          </p>
          <div className="flex justify-center space-x-1">
            <ApperIcon name="Heart" className="w-3 h-3 text-red-400" />
            <ApperIcon name="Shield" className="w-3 h-3 text-green-400" />
            <ApperIcon name="Star" className="w-3 h-3 text-yellow-400" />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation