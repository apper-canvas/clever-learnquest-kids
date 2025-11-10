import childProfilesData from "@/services/mockData/childProfiles.json"

class ChildProfileService {
  constructor() {
    this.profiles = [...childProfilesData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.profiles]
  }

  async getById(id) {
    await this.delay(200)
    const profile = this.profiles.find(p => p.Id === parseInt(id))
    if (!profile) {
      throw new Error("Profile not found")
    }
    return { ...profile }
  }

  async create(profileData) {
    await this.delay(400)
    const newProfile = {
      ...profileData,
      Id: this.getNextId(),
      totalStars: 0,
      totalCoins: 0,
      createdAt: new Date().toISOString()
    }
    this.profiles.push(newProfile)
    return { ...newProfile }
  }

  async update(id, updateData) {
    await this.delay(300)
    const index = this.profiles.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Profile not found")
    }
    this.profiles[index] = { ...this.profiles[index], ...updateData }
    return { ...this.profiles[index] }
  }

  async delete(id) {
    await this.delay(250)
    const index = this.profiles.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Profile not found")
    }
    this.profiles.splice(index, 1)
    return true
  }

async addStars(profileId, stars) {
    await this.delay(200)
    const profileIndex = this.profiles.findIndex(p => p.Id === parseInt(profileId))
    if (profileIndex === -1) {
      throw new Error("Profile not found")
    }
    const updatedProfile = {
      ...this.profiles[profileIndex],
      totalStars: this.profiles[profileIndex].totalStars + stars
    }
    this.profiles[profileIndex] = updatedProfile
    return { ...updatedProfile }
  }

async addCoins(profileId, coins) {
    await this.delay(200)
    const profileIndex = this.profiles.findIndex(p => p.Id === parseInt(profileId))
    if (profileIndex === -1) {
      throw new Error("Profile not found")
    }
    const updatedProfile = {
      ...this.profiles[profileIndex],
      totalCoins: this.profiles[profileIndex].totalCoins + coins
    }
    this.profiles[profileIndex] = updatedProfile
    return { ...updatedProfile }
  }

  getNextId() {
    const maxId = this.profiles.reduce((max, profile) => Math.max(max, profile.Id), 0)
    return maxId + 1
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new ChildProfileService()