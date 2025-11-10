import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import GameArena from "@/components/organisms/GameArena"
import RewardCelebration from "@/components/organisms/RewardCelebration"
import { updateProfile } from "@/store/slices/childProfileSlice"
import gameService from "@/services/api/gameService"
import gameProgressService from "@/services/api/gameProgressService"
import childProfileService from "@/services/api/childProfileService"
import achievementService from "@/services/api/achievementService"
import dailyGoalService from "@/services/api/dailyGoalService"

const GamePage = () => {
  const { worldId, gameId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentProfile } = useSelector(state => state.childProfile)
  
  const [game, setGame] = useState(null)
  const [gameProgress, setGameProgress] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationData, setCelebrationData] = useState({})
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!currentProfile) {
        navigate("/")
        return
      }
      
      // Load game details
      const gameData = await gameService.getById(gameId)
      setGame(gameData)
      
      // Load current progress
      const progressData = await gameProgressService.getByGameId(currentProfile.Id, gameId)
      setGameProgress(progressData)
      
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load game")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [worldId, gameId, currentProfile])
  
  const handleGameComplete = async (result) => {
    if (!currentProfile) return
    
    try {
      const { score, starsEarned, questionsAnswered, correctAnswers } = result
      
      // Calculate coins based on performance
      const coinsEarned = starsEarned * 5 + (score >= 90 ? 10 : score >= 70 ? 5 : 0)
      
      // Update game progress
      const progressUpdate = {
        profileId: currentProfile.Id.toString(),
        worldId,
        gameId,
        difficultyLevel: gameProgress?.difficultyLevel || 1,
        starsEarned: Math.max(starsEarned, gameProgress?.starsEarned || 0),
        highScore: Math.max(score, gameProgress?.highScore || 0),
        attemptsCount: (gameProgress?.attemptsCount || 0) + 1,
        averageAccuracy: gameProgress?.averageAccuracy 
          ? (gameProgress.averageAccuracy + score) / 2 
          : score
      }
      
      await gameProgressService.update(currentProfile.Id, gameId, progressUpdate)
      
      // Update profile stars and coins
      const updatedProfile = await childProfileService.addStars(currentProfile.Id, starsEarned)
      await childProfileService.addCoins(currentProfile.Id, coinsEarned)
      
      // Check for new achievements
      const allProgress = await gameProgressService.getByProfileId(currentProfile.Id)
      const newAchievements = await achievementService.checkAndAwardBadges(
        currentProfile.Id,
        [...allProgress, progressUpdate],
        updatedProfile.totalStars,
        updatedProfile.totalCoins
      )
      
      // Update daily goals
      try {
        await dailyGoalService.completeGame(currentProfile.Id, gameId)
      } catch (err) {
        console.log("Daily goals update failed:", err.message)
      }
      
      // Update Redux store
      dispatch(updateProfile({
        ...updatedProfile,
        totalStars: updatedProfile.totalStars,
        totalCoins: updatedProfile.totalCoins
      }))
      
      // Show celebration
      setCelebrationData({
        gameResult: result,
        rewards: {
          starsEarned,
          coinsEarned
        },
        achievements: newAchievements
      })
      setShowCelebration(true)
      
      // Show toast
      if (starsEarned > 0) {
        toast.success(`Amazing! You earned ${starsEarned} star${starsEarned > 1 ? 's' : ''}! ⭐`)
      }
      
    } catch (err) {
      console.error("Failed to save game progress:", err)
      toast.error("Game completed but couldn't save progress")
    }
  }
  
  const handleCelebrationClose = () => {
    setShowCelebration(false)
    navigate(`/world/${worldId}`)
  }
  
  if (!currentProfile) {
    navigate("/")
    return null
  }
  
  if (loading) {
    return <Loading message="Loading your game..." />
  }
  
  if (error) {
    return <ErrorView error={error} onRetry={loadData} />
  }
  
  if (!game) {
    return <ErrorView error="Game not found" onRetry={loadData} />
  }
  
  return (
    <>
      <GameArena
        game={game}
        onGameComplete={handleGameComplete}
        difficultyLevel={gameProgress?.difficultyLevel || 1}
      />
      
      <RewardCelebration
        isVisible={showCelebration}
        onClose={handleCelebrationClose}
        {...celebrationData}
      />
    </>
  )
}

export default GamePage