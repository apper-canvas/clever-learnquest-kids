import gamesData from "@/services/mockData/games.json"

class GameService {
  constructor() {
    this.games = [...gamesData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.games]
  }

  async getById(gameId) {
    await this.delay(200)
    const game = this.games.find(g => g.gameId === gameId)
    if (!game) {
      throw new Error("Game not found")
    }
    return { ...game }
  }

  async getByWorldId(worldId) {
    await this.delay(250)
    return this.games.filter(game => game.worldId === worldId)
  }

  async getGamesByAge(age) {
    await this.delay(200)
    return this.games.filter(game => {
      const [minAge, maxAge] = game.ageRange.split("-").map(Number)
      return age >= minAge && age <= maxAge
    })
  }

  async getRecommendedGames(profileAge, worldId = null) {
    await this.delay(300)
    let filteredGames = this.games.filter(game => {
      const [minAge, maxAge] = game.ageRange.split("-").map(Number)
      return profileAge >= minAge && profileAge <= maxAge
    })
    
    if (worldId) {
      filteredGames = filteredGames.filter(game => game.worldId === worldId)
    }
    
    // Return random selection of 3 games
    const shuffled = [...filteredGames].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3)
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new GameService()