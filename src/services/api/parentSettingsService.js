import parentSettingsData from "@/services/mockData/parentSettings.json"

class ParentSettingsService {
  constructor() {
    this.settings = { ...parentSettingsData }
  }

  async get() {
    await this.delay(300)
    return { ...this.settings }
  }

  async update(updateData) {
    await this.delay(400)
    this.settings = { ...this.settings, ...updateData }
    return { ...this.settings }
  }

  async validatePin(pin) {
    await this.delay(200)
    return this.settings.pin === pin
  }

  async updatePin(newPin) {
    await this.delay(300)
    this.settings.pin = newPin
    return true
  }

  async getSessionTimeLimit() {
    await this.delay(150)
    return this.settings.sessionTimeLimit
  }

  async updateSessionTimeLimit(minutes) {
    await this.delay(250)
    this.settings.sessionTimeLimit = minutes
    return { ...this.settings }
  }

  async getAllowedWorlds() {
    await this.delay(200)
    return [...this.settings.allowedWorlds]
  }

  async updateAllowedWorlds(worlds) {
    await this.delay(300)
    this.settings.allowedWorlds = [...worlds]
    return { ...this.settings }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new ParentSettingsService()