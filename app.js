const express = require('express')
const app = express()
app.use(express.json());
const port = 4000

app.get('/', (req, res) => res.send(`taskTonic listening on port ${port}!`))
app.listen(port, () => console.log(`taskTonic listening on port ${port}!`))