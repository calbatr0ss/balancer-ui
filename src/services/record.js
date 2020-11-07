export const getRecords = async () => {
	const response = await fetch("/records")
	const data = await response.json()
	return data
}

export const createRecord = async (payload) => {
	const response = await fetch("/records", {
		method: "POST",
		body: JSON.stringify(payload),
		headers: { "Content-Type": "application/json" },
	})
	const { recordId } = await response.json()
	return recordId
}

export const deleteRecord = async (recordId) => {
	const response = await fetch(`/records/${recordId}`, { method: "DELETE" })
	return response.status
}

export const getNetWorth = async () => {
	const response = await fetch("/records/net")
	const data = await response.json()
	return data
}

export const getTypeSum = async (type) => {
	const response = await fetch("/records/sum?" + new URLSearchParams({ type }))
	const data = await response.json()
	return data
}
