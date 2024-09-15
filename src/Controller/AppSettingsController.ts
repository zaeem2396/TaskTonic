import { Request, Response } from 'express'
import AppSettings from '../Models/AppSettings'

class AppSettingsController {

  private appSettings: AppSettings

  constructor() {
    this.appSettings = new AppSettings()
  }

  getSettings = async (_req: Request, res: Response) => {
    try {
      const settings = await this.appSettings.getAppSettings()
      return res.status(200).json(settings)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: error })
    }
  }

  createSettings = async (req: Request, res: Response) => {
    try {
      const { name, value } = req.body
      const data = { name: name, value: value }
      const isSettingCreated = await this.appSettings.createAppSettings(data)
      return res.status(200).json(isSettingCreated)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: error })
    }
  }

  updateSettings = async (req: Request, res: Response) => {
    try {
      const { id, name, value } = req.body
      const data = { name: name, value: value }
      const isSettingUpdated = await this.appSettings.updateAppSettings(id, data)
      return res.status(200).json(isSettingUpdated)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: error })
    }
  }

  deleteSettings = async (req: Request, res: Response) => {
    try {
      const { id } = req.body
      const isSettingDeleted = await this.appSettings.deleteAppSettings(id)
      return res.status(200).json(isSettingDeleted)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: error })
    }
  }
}

export default AppSettingsController