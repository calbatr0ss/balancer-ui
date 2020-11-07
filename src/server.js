// Backend for Frontend (BFF) -- Serve app and route to balancer-api

const express = require("express")
const path = require("path")
const axios = require("axios")

const port = process.env.PORT || 3001
const balancerApiUrl = process.env.BALANCER_API_URL

const app = express()
app.use(express.json())

app.get("/records", async (req, res) => {
	let response
	try {
		response = await axios.get(`${balancerApiUrl}/records`)
		res.json(response.data)
		return
	} catch (error) {
		console.error(error)
		res.sendStatus((response && response.statusCode) || 500)
		return
	}
})

app.post("/records", async (req, res) => {
	let response
	try {
		response = await axios.post(`${balancerApiUrl}/records`, req.body)
		res.json(response.data)
		return
	} catch (error) {
		console.error(error)
		res.sendStatus((response && response.statusCode) || 500)
		return
	}
})

app.put("/records/:id", async (req, res) => {
	const id = req.params.id
	let response
	try {
		response = await axios.put(`${balancerApiUrl}/records/${id}`, req.body)
		res.json(response.data)
		return
	} catch (error) {
		console.error(error)
		res.sendStatus((response && response.statusCode) || 500)
		return
	}
})

app.delete("/records/:id", async (req, res) => {
	const id = req.params.id
	let response
	try {
		response = await axios.delete(`${balancerApiUrl}/records/${id}`)
		res.json(response.data)
		return
	} catch (error) {
		console.error(error)
		res.sendStatus((response && response.statusCode) || 500)
		return
	}
})

app.get("/records/net", async (req, res) => {
	let response
	try {
		response = await axios.get(`${balancerApiUrl}/records/net`)
		res.json(response.data)
		return
	} catch (error) {
		console.error(error)
		res.sendStatus((response && response.statusCode) || 500)
		return
	}
})

app.get("/records/sum", async (req, res) => {
	let response
	try {
		response = await axios.get(`${balancerApiUrl}/records/sum`, { params: req.query })
		res.json(response.data)
		return
	} catch (error) {
		console.error(error)
		res.sendStatus((response && response.statusCode) || 500)
		return
	}
})

// Serve html
app.use(express.static(path.join(__dirname, "..", "build")))
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "build", "index.html"))
})

app.listen(port, () => console.log(`BFF listening on port ${port}`))
