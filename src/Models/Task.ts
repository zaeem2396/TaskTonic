import { RowDataPacket } from "mysql2"
import Orm from "../Utils/Orm"
import Response from "../Utils/Response"
import { pool } from "../config/db"
import Validator from "../Utils/Validator"

class Task {
    private orm: Orm
    private pool = pool
    private response: Response
    private validator: Validator

    constructor() {
        this.pool = pool
        this.orm = new Orm()
        this.response = new Response()
        this.validator = new Validator()
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

    getTask = async (data: { page: number, limit: number, orderBy?: string, order?: string, priority?: string, status?: string, id?: number }) => {
        try {
            const { page, limit, orderBy = 'id', order = 'DESC', priority, status, id } = data;

            const offset = (page - 1) * limit;

            let whereClause = '';
            const queryParams: any[] = [];
            
            if (priority) {
                whereClause = `WHERE t.priority = ?`;
                queryParams.push(priority);
            }
            if (status) {
                whereClause = whereClause ? `${whereClause} AND t.status = ?` : `WHERE t.status = ?`;
                queryParams.push(status);
            }
            if (id) {
                whereClause = `WHERE t.assignedTo = ?`;
                queryParams.push(id);
            }

            const countSql = `
                SELECT COUNT(*) as totalRecords
                FROM task AS t
                ${whereClause}
            `;
            const [countResult] = await this.pool.query<RowDataPacket[]>(countSql, queryParams);
            const totalRecords = countResult[0].totalRecords;
            const totalPages = Math.ceil(totalRecords / limit);

            const sql = `
                SELECT t.id AS taskId, t.title, t.description, 
                       u.name AS reportor, uu.name AS assignedTo, 
                       t.priority, t.due_date, t.status
                FROM task AS t
                INNER JOIN users AS u ON t.assignee = u.id
                INNER JOIN users AS uu ON t.assignedTo = uu.id
                ${whereClause}
                ORDER BY t.${orderBy} ${order}
                LIMIT ? OFFSET ?
            `;

            queryParams.push(limit, offset);

            const [taskList] = await this.pool.query<RowDataPacket[]>(sql, queryParams);

            const response = {
                tasks: taskList,
                pagination: {
                    currentPage: page,
                    totalRecords: totalRecords,
                    totalPages: totalPages,
                    limit: limit
                }
            };

            return this.response.successResponse(200, 'Task list', response);
        } catch (error) {
            console.error(`Error fetching task: ${error}`);
            return this.response.errorResponse('Processing failed due to technical fault', 500, error);
        }
    }

    updateTask = async (data: any) => {
        try {
            let validationErrors: Record<string, string> = {}

            const validateField = (field: string, validatorFn: Function, errorMsg: string) => {
                if (!validatorFn(data[field])) {
                    validationErrors[field] = errorMsg
                }
            }

            validateField('id', this.validator.isRequired, 'Task id is required')

            validateField('priority', this.validator.doesPriorityExist, 'Invalid priority')
            if (!validationErrors.priority) validateField('priority', this.validator.isStringValid, 'Priority contains unwanted characters')

            if (Object.keys(validationErrors).length > 0) {
                return this.response.errorResponse('Validation errors', 400, validationErrors);
            }

            const isTaskExists = await this.orm.find('task', { id: data.id })

            if (isTaskExists.length === 0) {
                return this.response.notFoundResponse('Task not found', 404)
            }

            const isTaskUpdated = await this.orm.update('task', data.id, data)

            if (isTaskUpdated.affectedRows === 0) {
                return this.response.errorResponse('Failed to update task', 500, isTaskUpdated)
            } else {
                const getUpdatedTask = await this.orm.findOne('task', 'id', data.id)
                return this.response.successResponse(200, 'Task updated successfully', getUpdatedTask)
            }
        } catch (error) {
            console.error(`Error updating task: ${error}`);
            return this.response.errorResponse('Processing failed due to technical fault', 500, error);
        }
    }
}

export default Task