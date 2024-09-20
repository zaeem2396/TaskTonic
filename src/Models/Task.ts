import Orm from "../Utils/Orm"
import Response from "../Utils/Response"

class Task {
    private orm: Orm
    private response: Response

    constructor() {
        this.orm = new Orm()
        this.response = new Response()
    }

    createTask = async (data: any) => {
        try { 
            const isTaskCreated = await this.orm.create('task', data)
            if (isTaskCreated.affectedRows === 0) {
                return this.response.errorResponse('Failed to create task', 500, isTaskCreated)
            }
            const getRecentTaskId = await this.orm.findOne('task', 'id', isTaskCreated.insertId)
            const getTaskUrl = await this.orm.find('appSettings', { name: 'taskUrl' })
            const taskUrl = getTaskUrl[0].value.replace('{VAL}', getRecentTaskId.id)
            return this.response.successResponse(201, 'Task created successfully', taskUrl)
        } catch (error) {
            console.log(`Error creating task: ${error}`)
            return this.response.errorResponse('Processing failed due to technical fault', 500, error)
        }
    }
}

export default Task