import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Avatar from "@/components/atoms/Avatar"
import Badge from "@/components/atoms/Badge"
import ProgressBar from "@/components/atoms/ProgressBar"
import RewardDisplay from "@/components/molecules/RewardDisplay"
import AchievementBadge from "@/components/molecules/AchievementBadge"
import ApperIcon from "@/components/ApperIcon"
import { setCurrentProfile } from "@/store/slices/childProfileSlice"
import achievementService from "@/services/api/achievementService"
import gameProgressService from "@/services/api/gameProgressService"
import dailyGoalService from "@/services/api/dailyGoalService"

const ProfilePage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentProfile } = useSelector(state => state.childProfile)
  
  const [achievements, setAchievements] = useState([])
  const [gameStats, setGameStats] = useState({})
  const [weeklyProgress, setWeeklyProgress] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const loadData = async () => {
    if (!currentProfile) {
      navigate("/")
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      // Load achievements
      const achievementsData = await achievementService.getByProfileId(currentProfile.Id)
      setAchievements(achievementsData)
      
      // Load game statistics
      const progressData = await gameProgressService.getByProfileId(currentProfile.Id)
      const stats = {
        totalGamesPlayed: progressData.length,
        totalAttempts: progressData.reduce((sum, p) => sum + p.attemptsCount, 0),
        averageAccuracy: progressData.length > 0 
          ? progressData.reduce((sum, p) => sum + p.averageAccuracy, 0) / progressData.length
          : 0,
        perfectScores: progressData.filter(p => p.highScore === 100).length,
        mathGames: progressData.filter(p => p.worldId === "math").length,
        readingGames: progressData.filter(p => p.worldId === "reading").length
      }
      setGameStats(stats)
      
      // Load weekly progress
      const weeklyData = await dailyGoalService.getWeeklyProgress(currentProfile.Id)
      setWeeklyProgress(weeklyData)
      
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [currentProfile])
  
  const handleSwitchProfile = () => {
    dispatch(setCurrentProfile(null))
    navigate("/")
  }
  
  const handleEditProfile = () => {
    toast.info("Profile editing coming soon! 🎨")
  }
  
  if (!currentProfile) {
    navigate("/")
    return null
  }
  
  if (loading) {
    return <Loading message="Loading your profile..." />
  }
  
  if (error) {
    return <ErrorView error={error} onRetry={loadData} />
  }
  
  const completedDays = weeklyProgress.filter(day => day.isComplete).length
  const streak = Math.min(completedDays, 7)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              icon="ArrowLeft"
              className="text-gray-600"
            />
            
            <h1 className="text-2xl font-display font-bold text-gray-800">
              My Profile
            </h1>
            
            <Button
              variant="ghost"
              onClick={handleEditProfile}
              icon="Settings"
              className="text-gray-600"
            />
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Header */}
        <Card className="p-8 bg-gradient-to-r from-white to-gray-50">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="text-center md:text-left space-y-4">
              <Avatar 
                avatarId={currentProfile.avatarId}
                name={currentProfile.name}
                size="2xl"
                className="mx-auto md:mx-0 mascot-bounce"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwitchProfile}
                icon="Users"
              >
                Switch Character
              </Button>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h2 className="text-4xl font-display font-bold text-gray-800">
                  {currentProfile.name}
                </h2>
                <p className="text-xl text-gray-600 font-body">
                  Age {currentProfile.age} • Learning Champion
                </p>
              </div>
              
              <div className="space-y-3">
                <RewardDisplay 
                  stars={currentProfile.totalStars}
                  coins={currentProfile.totalCoins}
                  size="lg"
                />
                
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <Badge variant="primary" size="lg">
                    <ApperIcon name="Target" className="w-4 h-4 mr-1" />
                    {gameStats.totalGamesPlayed} Games
                  </Badge>
                  <Badge variant="success" size="lg">
                    <ApperIcon name="Award" className="w-4 h-4 mr-1" />
                    {achievements.length} Badges
                  </Badge>
                  <Badge variant="accent" size="lg">
                    <ApperIcon name="Flame" className="w-4 h-4 mr-1" />
                    {streak} Day Streak
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Game Stats */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <ApperIcon name="BarChart3" className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-display font-bold text-gray-800">
                Game Stats
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-body">Total Games</span>
                <span className="text-lg font-bold text-gray-800">{gameStats.totalGamesPlayed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-body">Average Score</span>
                <span className="text-lg font-bold text-gray-800">
                  {Math.round(gameStats.averageAccuracy || 0)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-body">Perfect Scores</span>
                <span className="text-lg font-bold text-gray-800">{gameStats.perfectScores}</span>
              </div>
            </div>
          </Card>
          
          {/* World Progress */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                <ApperIcon name="Globe" className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-display font-bold text-gray-800">
                World Progress
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-body">Math World</span>
                  <span className="text-gray-800 font-semibold">{gameStats.mathGames} games</span>
                </div>
                <ProgressBar
                  progress={gameStats.mathGames}
                  max={10}
                  variant="default"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-body">Reading Land</span>
                  <span className="text-gray-800 font-semibold">{gameStats.readingGames} games</span>
                </div>
                <ProgressBar
                  progress={gameStats.readingGames}
                  max={10}
                  variant="secondary"
                />
              </div>
            </div>
          </Card>
          
          {/* Learning Streak */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                <ApperIcon name="Flame" className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-display font-bold text-gray-800">
                Learning Streak
              </h3>
            </div>
            
            <div className="text-center space-y-3">
              <div className="text-4xl font-display font-bold text-orange-600">
                {streak}
              </div>
              <div className="text-sm text-gray-600 font-body">
                {streak === 1 ? "day" : "days"} in a row! 🔥
              </div>
              
              <div className="flex justify-center space-x-1">
                {Array.from({ length: 7 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full ${
                      i < streak 
                        ? "bg-gradient-to-r from-orange-400 to-red-400" 
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>
        
        {/* Achievements */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl flex items-center justify-center">
              <ApperIcon name="Award" className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-gray-800">
                My Badges
              </h3>
              <p className="text-gray-600 font-body">
                {achievements.length} badge{achievements.length !== 1 ? 's' : ''} earned!
              </p>
            </div>
          </div>
          
          {achievements.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {achievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.Id}
                  achievement={achievement}
                  size="lg"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <ApperIcon name="Star" className="w-16 h-16 text-gray-300 mx-auto" />
              <p className="text-gray-500 font-body">
                Keep playing games to earn your first badge! 🏆
              </p>
            </div>
          )}
        </Card>
        
        {/* Encouragement */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <ApperIcon name="Heart" className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-display font-bold text-gray-800">
              Keep up the amazing work, {currentProfile.name}! 🌟
            </h3>
            <p className="text-gray-600 font-body max-w-2xl mx-auto">
              You're doing fantastic! Every game you play helps you learn and grow. 
              Keep exploring, keep learning, and keep being awesome! 
            </p>
            
            <Button
              onClick={() => navigate("/")}
              className="mt-4"
            >
              Continue Learning
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ProfilePage