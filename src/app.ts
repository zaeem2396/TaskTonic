import express, {Request, Response} from 'express'
const app = express()
app.use(express.json());

import appSettingsRoute from './Route/AppSettingsRoute'
app.use('/api/v1', appSettingsRoute)


const port: number = 4000

// Start the server
app.get('/', (_req: Request, res: Response) => res.send(`taskTonic listening on port ${port}!`))
app.listen(port, () => console.log(`taskTonic listening on port ${port}!`))