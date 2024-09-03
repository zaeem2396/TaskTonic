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
}

module.exports = new AppSettings()