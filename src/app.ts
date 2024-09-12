import express, {Request, Response} from 'express'
import appSettingsRoute from './Routes/AppSettingsRoute'
import SeedRoute from './Routes/SeedRoute'

const app = express()
app.use(express.json());

app.use('/api/v1', appSettingsRoute)
app.use('/api/v1', SeedRoute)

const port: number = 4000

// Start the server
app.get('/', (_req: Request, res: Response) => res.send(`taskTonic listening on port ${port}!`))
app.listen(port, () => console.log(`taskTonic listening on port ${port}!`))