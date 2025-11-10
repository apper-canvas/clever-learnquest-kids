import gameProgressData from "@/services/mockData/gameProgress.json"

class GameProgressService {
  constructor() {
    this.progress = [...gameProgressData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.progress]
  }

  async getByProfileId(profileId) {
    await this.delay(250)
    return this.progress.filter(p => p.profileId === profileId.toString())
  }

  async getByGameId(profileId, gameId) {
    await this.delay(200)
    const progress = this.progress.find(p => 
      p.profileId === profileId.toString() && p.gameId === gameId
    )
    return progress ? { ...progress } : null
  }

  async create(progressData) {
    await this.delay(350)
    const newProgress = {
      ...progressData,
      lastPlayedAt: new Date().toISOString()
    }
    this.progress.push(newProgress)
    return { ...newProgress }
  }

  async update(profileId, gameId, updateData) {
    await this.delay(300)
    const index = this.progress.findIndex(p => 
      p.profileId === profileId.toString() && p.gameId === gameId
    )
    
    if (index === -1) {
      // Create new progress record if doesn't exist
      const newProgress = {
        profileId: profileId.toString(),
        gameId,
        ...updateData,
        lastPlayedAt: new Date().toISOString()
      }
      this.progress.push(newProgress)
      return { ...newProgress }
    }
    
    this.progress[index] = { 
      ...this.progress[index], 
      ...updateData, 
      lastPlayedAt: new Date().toISOString() 
    }
    return { ...this.progress[index] }
  }

  async getWorldProgress(profileId, worldId) {
    await this.delay(250)
    return this.progress.filter(p => 
      p.profileId === profileId.toString() && p.worldId === worldId
    )
  }

  async getRecentProgress(profileId, days = 7) {
    await this.delay(200)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return this.progress.filter(p => {
      if (p.profileId !== profileId.toString()) return false
      const lastPlayed = new Date(p.lastPlayedAt)
      return lastPlayed >= cutoffDate
    })
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new GameProgressService()