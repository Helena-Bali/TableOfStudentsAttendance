const express = require('express')
const path = require ('path')
const cors = require ('cors')
const config = require('config')
const { readFile } = require('fs').promises

const server = express()

const PORT = config.get('port') || 5000

const middleware = [
    cors(),
    express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
    express.json({ limit: '50mb', extended: true }),
]

middleware.forEach((it) => server.use(it))

server.get('/api/v1/students', async (req,res) => {
    const readGoods = await readFile(`${__dirname}/server-data/students.json`)
        .then(f => JSON.parse(f))
        .catch(() => ({message: 'There is no students here'}))
    res.json(readGoods)
})

server.get('/api/v1/groups', async (req,res) => {
    const readGoods = await readFile(`${__dirname}/server-data/groups.json`)
        .then(f => JSON.parse(f))
        .catch(() => ({message: 'There is no subjects here'}))
    res.json(readGoods)
})

if (process.env.NODE_ENV === 'production&&') {
    server.use('/', express.static(path.join(__dirname), 'client', 'build'))
    server.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

server.listen(PORT,() => {console.log(`App is running on port ${PORT}`)})

module.exports = server
