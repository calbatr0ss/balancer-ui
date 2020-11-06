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
		const body = JSON.parse(req.body)
		const recordId = incrementCounter()
		records[recordId] = {
			type: body.type,
			name: body.name,
			balance: parseFloat(body.balance),
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
	// TODO: net worth sum
	rest.get("/records/sum", (req, res, ctx) => {
		let sum = 0
		for (const key in records) {
			const record = records[key]
			sum += record.balance
		}
		return res(ctx.status(200), ctx.json({ sum }))
	}),
	// TODO: assets sum
	rest.get("/records/assets/sum", (req, res, ctx) => {
		let sum = 0
		const assets = Object.values(records).filter((value) => value.type.toLowerCase() === "asset")
		for (let record of assets) {
			sum += record.balance
		}
		return res(ctx.status(200), ctx.json({ sum }))
	}),
	// TODO: liabilities sum
	rest.get("/records/liabilities/sum", (req, res, ctx) => {
		let sum = 0
		const assets = Object.values(records).filter(
			(value) => value.type.toLowerCase() === "liability"
		)
		for (let record of assets) {
			sum += record.balance
		}
		return res(ctx.status(200), ctx.json({ sum }))
	}),
]
