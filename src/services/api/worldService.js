import worldsData from "@/services/mockData/worlds.json"

class WorldService {
  constructor() {
    this.worlds = [...worldsData]
  }

  async getAll() {
    await this.delay(250)
    return [...this.worlds]
  }

  async getById(worldId) {
    await this.delay(200)
    const world = this.worlds.find(w => w.worldId === worldId)
    if (!world) {
      throw new Error("World not found")
    }
    return { ...world }
  }

  async getUnlockedWorlds(profileAge) {
    await this.delay(200)
    return this.worlds.filter(world => 
      world.isUnlocked && 
      profileAge >= world.minAge && 
      profileAge <= world.maxAge
    )
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new WorldService()