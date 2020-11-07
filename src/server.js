// Backend for Frontend (BFF) -- Serve app and route to balancer-api

const express = require("express")
const path = require("path")
const axios = require("axios")

const port = process.env.PORT || 3001
const balancerApiUrl = process.env.BALANCER_API_URL

const app = express()

app.get("/records", async (req, res) => {
	try {
		const response = await axios.get(`${balancerApiUrl}/records`)
		res.send()
	} catch (error) {}
})
app.post("/records", (req, res) => {})
app.put("/records/:id", (req, res) => {})
app.delete("/records/:id", (req, res) => {})
app.get("/records/sum", (req, res) => {})
app.get("/records/assets/sum", (req, res) => {})
app.get("/records/liabilities/sum", (req, res) => {})

// Serve html
app.use(express.static(path.join(__dirname, "..", "build")))
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "build", "index.html"))
})

app.listen(port, () => console.log(`BFF listening on port ${port}`))
