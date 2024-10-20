import server from './src/app.js'

const PORT = process.env.PORT || 3052
server.listen(PORT, () => {
    console.log(`Server is starting with Port: ${PORT}`)
})

process.on('SIGINT', () => {
    server.close(() => console.log('Exit Server Express'))
})
