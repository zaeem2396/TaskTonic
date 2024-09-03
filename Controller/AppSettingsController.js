const AppSettings = require('../Models/AppSettings')

class AppSettingsController {
  constructor() {
    this.app = AppSettings
  }
  getSettings = async (req, res) => {
    try {
      const settings = await this.app.getAppSettings()
      res.status(200).json(settings)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error })
    }
  }
}

module.exports = new AppSettingsController()