import app from "./src/app.js";

const PORT = process.env.PORT || 3052;
console.log(process.env.PORT)
const server = app.listen(PORT, () =>{
    console.log(`Server is starting with Port: ${PORT}`)
})

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`))
})