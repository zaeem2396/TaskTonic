const Orm = require('../Utils/Orm')
const Response = require('../Utils/Response')
const tableName = 'appSettings'

class AppSettings {
    constructor() {
        this.orm = Orm
        this.response = Response
    }

    createAppSettings = async (data) => {
        try {
            const isAppSettingExits = await this.orm.find('appSettings', { name: data.name })
            if (isAppSettingExits.length > 0) {
                return this.response.duplicateResponse('AppSetting already exists', 409)
            }
            const result = await this.orm.create(tableName, data)
            if (result[0].affectedRows === 1) {
                return this.response.successResponse('AppSetting created successfully', 200)
            } else {
                return this.response.errorResponse('Failed to create appSetting', 500)
            }
        } catch (error) {
            console.error(`Error creating record, error: ${error}`);
            return this.response.errorResponse('Processing failed due to technical fault', 500, error)
        }
    }

    getAppSettings = async () => {
        try {
            const settingsData = await this.orm.read(`${tableName}`)
            const appSettings = settingsData.reduce((acc, setting) => {
                acc[setting.name] = setting.value
                return acc
            }, {})
            return this.response.successResponse(200, 'success', appSettings)
        } catch (error) {
            console.error(`Error creating record, error: ${error}`);
            return this.response.errorResponse('Processing failed due to technical fault', 500, error)
        }
    }
}

module.exports = new AppSettings()