const { read } = require('../Utils/Orm')
const tableName = 'appSettings'

const getAppSettings = async () => {
    try {
        const settings = await read(`${tableName}`)
        return settings
    } catch (error) {
        console.error(`Error creating record, error: ${error}`);
        throw error
    }
}

module.exports = { getAppSettings }