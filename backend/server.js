import express from 'express'

const app = express()
const PORT = process.env.PORT_NUMBER || 8000

app.get('/', (req, res) => {
    console.log("Accepted")
    res.status(200).send("BLU")
})

app.listen(PORT, () => {
    console.log(`Server Started at http://localhost:${PORT}`)
})