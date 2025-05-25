import express from 'express'
import dotenv from 'dotenv'
import { generateProducts } from './openai'

dotenv.config()

const app = express()

app.use(express.json())
app.post("/generate", async (req, res) => {
    try {
        const products = await generateProducts(req.body.message)
        res.json(products)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error"})
    }
})

export default app