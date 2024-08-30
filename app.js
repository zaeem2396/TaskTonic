const express = require('express')
const app = express()
const { isDBConnected } = require('./config/db')
app.use(express.json());
const port = 4000

app.get('/', (req, res) => res.send(`taskTonic listening on port ${port}!`))
app.get('/con', async (req, res) => {
    const dbConnected = await isDBConnected();
    if (dbConnected) {
        res.send('Database is connected!');
    } else {
        res.send('Failed to connect to the database.');
    }
});
app.listen(port, () => console.log(`taskTonic listening on port ${port}!`))