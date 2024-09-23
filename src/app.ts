import express, {Request, Response} from 'express'
import dotenv from 'dotenv'
import appSettingsRoute from './Routes/AppSettingsRoute'
import userRoute from './Routes/UserRoute'
import SeedRoute from './Routes/SeedRoute'
import GeminiRoute from './Routes/GeminiRoute'
import TaskRoute from './Routes/TaskRoute'

dotenv.config()
const app = express()
app.use(express.json());

app.use('/api/v1', appSettingsRoute) 
app.use('/api/v1', userRoute)
app.use('/api/v1', SeedRoute)
app.use('/api/v1', GeminiRoute)
app.use('/api/v1', TaskRoute)

const port: number = 4000

// Start the server
app.get('/', (_req: Request, res: Response) => res.send(`taskTonic listening on port ${port}!`))
app.listen(port, () => console.log(`taskTonic listening on port ${port}!`))