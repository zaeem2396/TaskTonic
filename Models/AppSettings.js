const Orm = require('../Utils/Orm')
const tableName = 'appSettings'

class AppSettings {
    constructor() {
        this.orm = Orm
    }
    getAppSettings = async () => {
        try {
            const settings = await this.orm.read(`${tableName}`)
            return settings
        } catch (error) {
            console.error(`Error creating record, error: ${error}`);
            throw error
        }
    }

    createAppSettings = async (data) => {
        try {
            const result = await this.orm.create(tableName, data)
            if (result[0].affectedRows === 1) {
                return {
                    code: 200,
                    message: 'AppSetting created successfully'
                }
            } else {
                return {
                    code: 500,
                    message: 'Processing failed due to technical fault'
                }
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = new AppSettings()