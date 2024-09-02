const appSettings = require('../Models/AppSettings')

const getSettings = async (req, res) => {
  try {
    const settings = await appSettings.getAppSettings()
    res.status(200).json(settings)
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

module.exports = { getSettings }