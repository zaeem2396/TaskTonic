const express = require('express')
const app = express()
app.use(express.json());


const appSettingsRoute = require('./Route/AppSettingsRoute')
app.use('/api/v1', appSettingsRoute)


const port = 4000

// Start the server
app.get('/', (req, res) => res.send(`taskTonic listening on port ${port}!`))
app.listen(port, () => console.log(`taskTonic listening on port ${port}!`))