import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import WorldCard from "@/components/molecules/WorldCard"
import DailyGoalCard from "@/components/molecules/DailyGoalCard"
import ProfileSelector from "@/components/molecules/ProfileSelector"
import RewardDisplay from "@/components/molecules/RewardDisplay"
import Avatar from "@/components/atoms/Avatar"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { setLoading, setError, setProfiles, setCurrentProfile } from "@/store/slices/childProfileSlice"
import childProfileService from "@/services/api/childProfileService"
import worldService from "@/services/api/worldService"
import gameService from "@/services/api/gameService"
import gameProgressService from "@/services/api/gameProgressService"
import dailyGoalService from "@/services/api/dailyGoalService"

const HomePage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { profiles, currentProfile, loading, error } = useSelector(state => state.childProfile)
  
  const [worlds, setWorlds] = useState([])
  const [worldStats, setWorldStats] = useState({})
  const [dailyGoals, setDailyGoals] = useState(null)
  const [showProfileSelector, setShowProfileSelector] = useState(false)
  
  const loadData = async () => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      
      // Load profiles
      const profilesData = await childProfileService.getAll()
      dispatch(setProfiles(profilesData))
      
      // Set current profile if none selected
      if (!currentProfile && profilesData.length > 0) {
        dispatch(setCurrentProfile(profilesData[0]))
      }
      
      // Load worlds
      const worldsData = await worldService.getAll()
      setWorlds(worldsData)
      
      // Load world stats and daily goals if profile is selected
      if (currentProfile || profilesData.length > 0) {
        const activeProfile = currentProfile || profilesData[0]
        await loadProfileData(activeProfile)
      }
      
    } catch (err) {
      dispatch(setError(err.message))
      toast.error("Failed to load data")
    } finally {
      dispatch(setLoading(false))
    }
  }
  
  const loadProfileData = async (profile) => {
    try {
      // Load world statistics
      const stats = {}
      const allGames = await gameService.getAll()
      const profileProgress = await gameProgressService.getByProfileId(profile.Id)
      
      for (const world of worlds) {
        const worldGames = allGames.filter(g => g.worldId === world.worldId)
        const worldProgress = profileProgress.filter(p => p.worldId === world.worldId)
        const completedGames = worldProgress.filter(p => p.starsEarned > 0).length
        const totalStars = worldProgress.reduce((sum, p) => sum + p.starsEarned, 0)
        
        stats[world.worldId] = {
          totalGames: worldGames.length,
          completedGames,
          totalStars
        }
      }
      setWorldStats(stats)
      
      // Load daily goals
      const goals = await dailyGoalService.getTodaysGoals(profile.Id)
      setDailyGoals(goals)
      
    } catch (err) {
      console.error("Failed to load profile data:", err)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  useEffect(() => {
    if (currentProfile && worlds.length > 0) {
      loadProfileData(currentProfile)
    }
  }, [currentProfile, worlds])
  
  const handleSelectProfile = (profile) => {
    dispatch(setCurrentProfile(profile))
    setShowProfileSelector(false)
    toast.success(`Welcome back, ${profile.name}! 🎉`)
  }
  
  const handleCreateProfile = () => {
    navigate("/create-profile")
  }
  
  const handleWorldClick = (world) => {
    if (!currentProfile) {
      toast.error("Please select a profile first!")
      setShowProfileSelector(true)
      return
    }
    navigate(`/world/${world.worldId}`)
  }
  
  const handleGameClick = (gameId) => {
    if (!currentProfile) {
      toast.error("Please select a profile first!")
      setShowProfileSelector(true)
      return
    }
    
    // Find which world this game belongs to
    const world = worlds.find(w => 
      Object.keys(worldStats).includes(w.worldId)
    )
    
    if (world) {
      navigate(`/game/${world.worldId}/${gameId}`)
    }
  }
  
  if (loading) {
    return <Loading message="Loading your learning adventure..." />
  }
  
  if (error) {
    return <ErrorView error={error} onRetry={loadData} />
  }
  
  if (profiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
        <Empty 
          title="Welcome to LearnQuest Kids!"
          description="Create your first character to start your learning adventure!"
          actionText="Create Character"
          onAction={handleCreateProfile}
          icon="Sparkles"
        />
      </div>
    )
  }
  
  if (showProfileSelector || !currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-6xl mx-auto py-8">
          <ProfileSelector
            profiles={profiles}
            currentProfile={currentProfile}
            onSelectProfile={handleSelectProfile}
            onCreateProfile={handleCreateProfile}
          />
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 lg:hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar 
                avatarId={currentProfile.avatarId}
                name={currentProfile.name}
                size="lg"
              />
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-800">
                  Hi, {currentProfile.name}! 👋
                </h1>
                <p className="text-gray-600 font-body">
                  Ready to learn and have fun?
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowProfileSelector(true)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="Users" className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mt-4">
            <RewardDisplay 
              stars={currentProfile.totalStars}
              coins={currentProfile.totalCoins}
              size="lg"
            />
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Section (Desktop) */}
        <div className="hidden lg:block">
          <Card className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-display font-bold text-gray-800">
                  Hi, {currentProfile.name}! 👋
                </h1>
                <p className="text-xl text-gray-600 font-body">
                  Ready to explore amazing worlds and learn new things?
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <Avatar 
                  avatarId={currentProfile.avatarId}
                  name={currentProfile.name}
                  size="2xl"
                  className="mascot-bounce"
                />
                <RewardDisplay 
                  stars={currentProfile.totalStars}
                  coins={currentProfile.totalCoins}
                  size="lg"
                />
              </div>
            </div>
          </Card>
        </div>
        
        {/* Daily Goals */}
        {dailyGoals && (
          <DailyGoalCard 
            dailyGoals={dailyGoals}
            onGameClick={handleGameClick}
          />
        )}
        
        {/* Learning Worlds */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-display font-bold text-gray-800">
              Choose Your Adventure! 🌟
            </h2>
            <p className="text-gray-600 font-body">
              Click on any world to start learning and playing!
            </p>
          </div>
          
          {worlds.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {worlds.map((world) => (
                <WorldCard
                  key={world.Id}
                  world={world}
                  totalGames={worldStats[world.worldId]?.totalGames || 0}
                  completedGames={worldStats[world.worldId]?.completedGames || 0}
                  totalStars={worldStats[world.worldId]?.totalStars || 0}
                  onClick={() => handleWorldClick(world)}
                />
              ))}
            </div>
          ) : (
            <Empty 
              title="No worlds available"
              description="Check back soon for amazing learning worlds!"
              showAction={false}
              icon="Globe"
            />
          )}
        </div>
        
        {/* Fun Facts Footer */}
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-100">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <ApperIcon name="Lightbulb" className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="text-lg font-display font-bold text-gray-800">
              Fun Learning Fact! 💡
            </h3>
            <p className="text-gray-600 font-body max-w-2xl mx-auto">
              Playing educational games for just 15 minutes a day can help improve math and reading skills while having fun! 
              Keep exploring and learning new things every day! 🚀
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default HomePage