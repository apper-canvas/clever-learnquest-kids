import achievementsData from "@/services/mockData/achievements.json"
import badgesData from "@/services/mockData/badges.json"

class AchievementService {
  constructor() {
    this.achievements = [...achievementsData]
    this.badges = [...badgesData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.achievements]
  }

  async getByProfileId(profileId) {
    await this.delay(250)
    const profileAchievements = this.achievements.filter(a => 
      a.profileId === profileId.toString()
    )
    
    // Join with badge information
    return profileAchievements.map(achievement => {
      const badge = this.badges.find(b => b.badgeId === achievement.badgeId)
      return {
        ...achievement,
        badge: badge || null
      }
    })
  }

  async create(achievementData) {
    await this.delay(400)
    const newAchievement = {
      ...achievementData,
      Id: this.getNextId(),
      earnedAt: new Date().toISOString()
    }
    this.achievements.push(newAchievement)
    return { ...newAchievement }
  }

  async getBadges() {
    await this.delay(200)
    return [...this.badges]
  }

  async getBadgeById(badgeId) {
    await this.delay(150)
    const badge = this.badges.find(b => b.badgeId === badgeId)
    if (!badge) {
      throw new Error("Badge not found")
    }
    return { ...badge }
  }

  async checkAndAwardBadges(profileId, gameProgress, totalStars, totalCoins) {
    await this.delay(300)
    const newAchievements = []
    const existingAchievements = this.achievements.filter(a => 
      a.profileId === profileId.toString()
    )
    
    // Check for various achievement conditions
    const achievementChecks = [
      {
        badgeId: "first-star",
        condition: totalStars >= 1 && !existingAchievements.find(a => a.badgeId === "first-star")
      },
      {
        badgeId: "star-collector",
        condition: totalStars >= 50 && !existingAchievements.find(a => a.badgeId === "star-collector")
      },
      {
        badgeId: "coin-master",
        condition: totalCoins >= 100 && !existingAchievements.find(a => a.badgeId === "coin-master")
      },
      {
        badgeId: "perfect-score",
        condition: gameProgress.some(p => p.highScore === 100) && !existingAchievements.find(a => a.badgeId === "perfect-score")
      }
    ]
    
    for (const check of achievementChecks) {
      if (check.condition) {
        const newAchievement = {
          Id: this.getNextId(),
          profileId: profileId.toString(),
          badgeId: check.badgeId,
          earnedAt: new Date().toISOString(),
          category: this.badges.find(b => b.badgeId === check.badgeId)?.category || "achievement"
        }
        this.achievements.push(newAchievement)
        newAchievements.push(newAchievement)
      }
    }
    
    return newAchievements
  }

  getNextId() {
    const maxId = this.achievements.reduce((max, achievement) => Math.max(max, achievement.Id), 0)
    return maxId + 1
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new AchievementService()