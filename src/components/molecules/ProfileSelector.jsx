import React from "react"
import Avatar from "@/components/atoms/Avatar"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const ProfileSelector = ({ 
  profiles, 
  currentProfile, 
  onSelectProfile, 
  onCreateProfile,
  className 
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-2xl font-display font-bold text-gray-800 text-center">
        Choose Your Character
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <Card
            key={profile.Id}
            variant="world"
            interactive
            onClick={() => onSelectProfile(profile)}
            className={cn(
              "p-6 text-center space-y-4 cursor-pointer",
              currentProfile?.Id === profile.Id && "ring-4 ring-primary/50 border-primary"
            )}
          >
            <Avatar 
              avatarId={profile.avatarId}
              size="xl"
              name={profile.name}
              className="mx-auto"
            />
            
            <div className="space-y-2">
              <h3 className="text-lg font-display font-bold text-gray-800">
                {profile.name}
              </h3>
              <p className="text-sm text-gray-600 font-body">
                Age {profile.age}
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-accent">
                <ApperIcon name="Star" className="w-4 h-4" />
                <span className="font-semibold">{profile.totalStars}</span>
              </div>
              <div className="flex items-center space-x-1 text-warning">
                <ApperIcon name="Coins" className="w-4 h-4" />
                <span className="font-semibold">{profile.totalCoins}</span>
              </div>
            </div>
          </Card>
        ))}
        
        {/* Create New Profile Card */}
        <Card
          variant="world"
          interactive
          onClick={onCreateProfile}
          className="p-6 text-center space-y-4 cursor-pointer border-dashed border-2 border-primary/30 hover:border-primary/60"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-white shadow-lift">
            <ApperIcon name="Plus" className="w-12 h-12 text-gray-400" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-display font-bold text-gray-700">
              New Character
            </h3>
            <p className="text-sm text-gray-500 font-body">
              Create your adventure!
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ProfileSelector