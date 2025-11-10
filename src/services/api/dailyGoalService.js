import dailyGoalsData from "@/services/mockData/dailyGoals.json"

class DailyGoalService {
  constructor() {
    this.dailyGoals = [...dailyGoalsData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.dailyGoals]
  }

  async getByProfileId(profileId) {
    await this.delay(250)
    return this.dailyGoals.filter(goal => goal.profileId === profileId.toString())
  }

  async getTodaysGoals(profileId) {
    await this.delay(200)
    const today = new Date().toISOString().split("T")[0]
    const todaysGoals = this.dailyGoals.find(goal => 
      goal.profileId === profileId.toString() && goal.date === today
    )
    
    if (!todaysGoals) {
      // Create today's goals if they don't exist
      return await this.createTodaysGoals(profileId)
    }
    
    return { ...todaysGoals }
  }

  async createTodaysGoals(profileId) {
    await this.delay(350)
    const today = new Date().toISOString().split("T")[0]
    
    // Sample recommended games (in real app, this would be based on progress/algorithm)
    const recommendedGames = ["counting-fun", "letter-match", "shape-sorter"]
    
    const newGoals = {
      profileId: profileId.toString(),
      date: today,
      recommendedGames,
      completedGames: [],
      isComplete: false
    }
    
    this.dailyGoals.push(newGoals)
    return { ...newGoals }
  }

  async completeGame(profileId, gameId) {
    await this.delay(250)
    const today = new Date().toISOString().split("T")[0]
    const goalIndex = this.dailyGoals.findIndex(goal => 
      goal.profileId === profileId.toString() && goal.date === today
    )
    
    if (goalIndex === -1) {
      throw new Error("Today's goals not found")
    }
    
    const goal = this.dailyGoals[goalIndex]
    if (!goal.completedGames.includes(gameId)) {
      goal.completedGames.push(gameId)
      goal.isComplete = goal.completedGames.length >= goal.recommendedGames.length
    }
    
    return { ...goal }
  }

  async getWeeklyProgress(profileId) {
    await this.delay(300)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const weeklyGoals = this.dailyGoals.filter(goal => {
      if (goal.profileId !== profileId.toString()) return false
      const goalDate = new Date(goal.date)
      return goalDate >= oneWeekAgo
    })
    
    return weeklyGoals.sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new DailyGoalService()