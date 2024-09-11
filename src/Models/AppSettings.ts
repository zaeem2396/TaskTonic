import Orm from '../Utils/Orm'
import Response from '../Utils/Response'

const tableName: string = 'appSettings'

class AppSettings {
    private orm: Orm
    private response: Response
    constructor() {
        this.orm = new Orm()
        this.response = new Response()
    }

    createAppSettings = async (data: any) => {
        try {
            const isAppSettingExits = await this.orm.find('appSettings', { name: data.name })
            if (isAppSettingExits.length > 0) {
                return this.response.duplicateResponse('AppSetting already exists', 409)
            }
            const result = await this.orm.create(tableName, data)
            if (result.affectedRows === 1) {
                return this.response.successResponse(200, 'AppSetting created successfully', await this.orm.findOne('appSettings', 'id', result.insertId))
            } else {
                return this.response.errorResponse('Failed to create appSetting', 500, result)
            }
        } catch (error) {
            console.error(`Error creating record, error: ${error}`);
            return this.response.errorResponse('Processing failed due to technical fault', 500, error)
        }
    }

    getAppSettings = async () => {
        try {
            const settingsData = await this.orm.read(`${tableName}`)
            const appSettings = settingsData.reduce((acc: Record<string, string>, setting: any) => {
                acc[setting.name] = setting.value
                return acc
            }, {})
            return this.response.successResponse(200, 'success', appSettings)
        } catch (error) {
            console.error(`Error creating record, error: ${error}`);
            return this.response.errorResponse('Processing failed due to technical fault', 500, error)
        }
    }

    updateAppSettings = async (id: number, data: any) => {
        try {            
            const isAppSettingExits = await this.orm.findOne('appSettings', 'name', data.name)
            if (!isAppSettingExits) {
                return this.response.notFoundResponse('AppSetting not found', 404)
            }
            const result = await this.orm.update(tableName, id, data)
            if (result.affectedRows === 1) {
                return this.response.successResponse(200, 'AppSetting updated successfully', await this.orm.findOne('appSettings', 'id', id))
            } else {
                return this.response.errorResponse('Failed to update appSetting', 500, result)
            }
        } catch (error) {
            console.error(`Error updating record, error: ${error}`);
            return this.response.errorResponse('Processing failed due to technical fault', 500, error)
        }
    }
}

export default AppSettings