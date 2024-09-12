import { Request, Response } from "express";
import { faker } from '@faker-js/faker'
import Orm from '../Utils/Orm'
import Lib from "../Utils/Lib";

class SeedDataController {
    private faker: typeof faker
    private orm: Orm
    private lib: Lib

    constructor() {
        this.faker = faker
        this.orm = new Orm()
        this.lib = new Lib()
    }

    populateTaskData = async (req: Request, res: Response) => {
        try {
            const { count } = req.body;
            let successCount = 0;
            let failureCount = 0;

            for (let i = 0; i < count; i++) {
                let assignee: string;
                let assignTo: string;

                do {
                    assignee = this.faker.string.numeric();
                } while (assignee === "0");

                do {
                    assignTo = this.faker.string.numeric();
                } while (assignTo === "0");

                const data = {
                    title: this.faker.lorem.sentence(),
                    description: this.faker.lorem.paragraph(),
                    assignee: this.faker.string.numeric(),
                    assignedTo: this.faker.string.numeric(),
                    priority: this.faker.helpers.arrayElement(['low', 'medium', 'high']),
                    due_date: this.lib.formatDate(this.faker.date.future()),
                    status: this.faker.helpers.arrayElement(['pending', 'in_progress', 'completed']),
                    created_at: this.lib.formatDate(this.faker.date.past()),
                    updated_at: this.lib.formatDate(this.faker.date.recent())
                };

                const result = await this.orm.create('task', data);
                if (result.affectedRows === 1) {
                    successCount++;
                } else {
                    failureCount++;
                }
            }

            if (successCount > 0) {
                return res.status(200).json({
                    message: `Successfully populated ${successCount} tasks`,
                    failures: failureCount
                });
            } else {
                return res.status(500).json({ message: 'No tasks were populated', failures: failureCount });
            }
        } catch (error) {
            console.log(`Error while populating DB: ${error}`);
            return res.status(500).json({ message: 'Error while populating DB', error });
        }
    };
}

export default SeedDataController