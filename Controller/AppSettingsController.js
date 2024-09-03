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

  createSettings = async (req, res) => {
    try {
      const { name, value } = req.body
      const data = { name: name, value: value }
      const isSettingCreated = await this.app.createAppSettings(data)
      res.status(200).json(isSettingCreated)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error })
    }
  }
}

module.exports = new AppSettingsController()