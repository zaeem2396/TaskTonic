import {Request, Response} from 'express'
import AppSettings from '../Models/AppSettings'

class AppSettingsController {
  
  private appSettings: AppSettings
  
  constructor() {
    this.appSettings = new AppSettings()
  }

  getSettings = async (_req: Request, res: Response) => {
    try {
      const settings = await this.appSettings.getAppSettings()
      res.status(200).json(settings)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error })
    }
  }

  createSettings = async (req: Request, res: Response) => {
    try {
      const { name, value } = req.body
      const data = { name: name, value: value }
      const isSettingCreated = await this.appSettings.createAppSettings(data)
      res.status(200).json(isSettingCreated)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error })
    }
  }
}

export default new AppSettingsController()