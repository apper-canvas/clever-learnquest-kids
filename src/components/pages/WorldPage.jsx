import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import GameCard from "@/components/molecules/GameCard"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ProgressBar from "@/components/atoms/ProgressBar"
import ApperIcon from "@/components/ApperIcon"
import worldService from "@/services/api/worldService"
import gameService from "@/services/api/gameService"
import gameProgressService from "@/services/api/gameProgressService"

const WorldPage = () => {
  const { worldId } = useParams()
  const navigate = useNavigate()
  const { currentProfile } = useSelector(state => state.childProfile)
  
  const [world, setWorld] = useState(null)
  const [games, setGames] = useState([])
  const [gameProgress, setGameProgress] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load world details
      const worldData = await worldService.getById(worldId)
      setWorld(worldData)
      
      // Load games for this world
      const gamesData = await gameService.getByWorldId(worldId)
      setGames(gamesData)
      
      // Load progress if profile is selected
      if (currentProfile) {
        const progressData = await gameProgressService.getByProfileId(currentProfile.Id)
        const worldProgress = progressData.filter(p => p.worldId === worldId)
        
        const progressMap = {}
        worldProgress.forEach(progress => {
          progressMap[progress.gameId] = progress
        })
        setGameProgress(progressMap)
      }
      
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load world data")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [worldId, currentProfile])
  
  const handleGameClick = (game) => {
    if (!currentProfile) {
      toast.error("Please select a profile first!")
      navigate("/")
      return
    }
    navigate(`/game/${worldId}/${game.gameId}`)
  }
  
  const handleBackClick = () => {
    navigate("/")
  }
  
  if (loading) {
    return <Loading message={`Loading ${worldId === "math" ? "Math World" : "Reading Land"}...`} />
  }
  
  if (error) {
    return <ErrorView error={error} onRetry={loadData} />
  }
  
  if (!world) {
    return <ErrorView error="World not found" onRetry={loadData} />
  }
  
  // Calculate world progress
  const totalGames = games.length
  const completedGames = Object.values(gameProgress).filter(p => p.starsEarned > 0).length
  const totalStars = Object.values(gameProgress).reduce((sum, p) => sum + p.starsEarned, 0)
  const maxStars = totalGames * 3
  const progressPercentage = totalGames > 0 ? (completedGames / totalGames) * 100 : 0
  
  const mascotIcons = {
    "NumberBot": "Bot",
    "WiseOwl": "Owl"
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleBackClick}
              icon="ArrowLeft"
              className="text-gray-600"
            />
            
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lift mascot-bounce ${
                world.worldId === "math"
                  ? "bg-gradient-to-br from-primary to-pink-400"
                  : "bg-gradient-to-br from-secondary to-teal-400"
              }`}>
                <ApperIcon 
                  name={mascotIcons[world.mascot] || "Smile"} 
                  className="w-8 h-8 text-white drop-shadow-sm" 
                />
              </div>
              
              <div>
                <h1 className="text-3xl font-display font-bold text-gray-800">
                  {world.name}
                </h1>
                <p className="text-gray-600 font-body">
                  {world.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Progress Overview */}
        {currentProfile && (
          <Card className="p-6 bg-gradient-to-r from-white to-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Progress Stats */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-gray-800">
                    {completedGames}
                  </div>
                  <div className="text-sm text-gray-600 font-body">
                    Games Completed
                  </div>
                </div>
                
                <ProgressBar
                  progress={progressPercentage}
                  label="World Progress"
                  variant={world.worldId === "math" ? "default" : "secondary"}
                  showLabel
                />
              </div>
              
              {/* Stars Earned */}
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <ApperIcon name="Star" className="w-8 h-8 text-accent sparkle" />
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-gray-800">
                    {totalStars}
                  </div>
                  <div className="text-sm text-gray-600 font-body">
                    Stars Earned
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-body">
                  out of {maxStars} possible
                </div>
              </div>
              
              {/* Achievement Level */}
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <ApperIcon 
                    name="Trophy" 
                    className={`w-8 h-8 ${
                      progressPercentage >= 100 ? "text-accent" :
                      progressPercentage >= 50 ? "text-warning" : "text-gray-400"
                    }`} 
                  />
                </div>
                <div>
                  <div className="text-lg font-display font-bold text-gray-800">
                    {progressPercentage >= 100 ? "Master!" :
                     progressPercentage >= 75 ? "Expert" :
                     progressPercentage >= 50 ? "Advanced" :
                     progressPercentage >= 25 ? "Beginner" : "Explorer"}
                  </div>
                  <div className="text-sm text-gray-600 font-body">
                    Achievement Level
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {/* Games Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-display font-bold text-gray-800">
              Choose Your Game! 🎮
            </h2>
            <p className="text-gray-600 font-body">
              Each game helps you learn something new and exciting!
            </p>
          </div>
          
          {games.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <GameCard
                  key={game.Id}
                  game={game}
                  progress={gameProgress[game.gameId]}
                  onClick={() => handleGameClick(game)}
                  worldColor={world.worldId}
                />
              ))}
            </div>
          ) : (
            <Empty 
              title="No games available"
              description="Check back soon for amazing learning games!"
              showAction={false}
              icon="Gamepad2"
            />
          )}
        </div>
        
        {/* Encouragement */}
        {currentProfile && (
          <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-100">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <ApperIcon name="Heart" className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-display font-bold text-gray-800">
                You're doing amazing, {currentProfile.name}! 🌟
              </h3>
              <p className="text-gray-600 font-body max-w-2xl mx-auto">
                {completedGames === 0 
                  ? "Try your first game and start earning stars! Every expert was once a beginner."
                  : completedGames < totalGames
                  ? `You've completed ${completedGames} games! Keep going to unlock more achievements and become a ${world.name} expert!`
                  : `Congratulations! You've mastered ${world.name}! You're a true learning champion!`
                }
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default WorldPage