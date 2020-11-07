import { rest } from "msw"
import { records, incrementCounter } from "./database"

export const handlers = [
	// Return all records
	rest.get("/records", (req, res, ctx) => {
		const recordsArray = Object.entries(records).map(([key, value]) => ({ ...value, id: key }))
		return res(ctx.status(200), ctx.json(recordsArray))
	}),
	// Add a record
	rest.post("/records", (req, res, ctx) => {
		const body = req.body
		const recordId = incrementCounter()
		records[recordId] = {
			type: body.type,
			name: body.name,
			balance: body.balance,
		}
		return res(ctx.status(201), ctx.json({ recordId }))
	}),
	// Update a record by id
	rest.put("/records/:id", (req, res, ctx) => {
		const { id } = req.params
		// Update with values from body
		records[id] = { ...records[id], ...req.body }
		return res(ctx.status(200))
	}),
	// Delete a record by id
	rest.delete("/records/:id", (req, res, ctx) => {
		const { id } = req.params
		// Remove entity from mock table
		delete records[id]
		return res(ctx.status(200))
	}),
	// Calculate net worth
	rest.get("/records/net", (req, res, ctx) => {
		let sum = 0
		for (const key in records) {
			const record = records[key]
			sum += record.balance
		}
		return res(ctx.status(200), ctx.json({ value: sum }))
	}),
	// Calculate a type sum
	rest.get("/records/sum", (req, res, ctx) => {
		const type = req.url.searchParams.get("type")
		let sum = 0
		const assets = Object.values(records).filter(
			(value) => value.type.toUpperCase() === type.toUpperCase()
		)
		for (let record of assets) {
			sum += record.balance
		}
		return res(ctx.status(200), ctx.json({ value: sum }))
	}),
]
