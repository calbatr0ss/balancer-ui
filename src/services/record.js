export const getRecords = async () => {
	const response = await fetch("/records")
	const data = await response.json()
	return data
}

export const createRecord = async (payload) => {
	const response = await fetch("/records", { method: "POST", body: JSON.stringify(payload) })
	const { recordId } = await response.json()
	return recordId
}

export const deleteRecord = async (recordId) => {
	const response = await fetch(`/records/${recordId}`, { method: "DELETE" })
	return response.status
}

export const getSum = async () => {
	const response = await fetch("/records/sum")
	const data = await response.json()
	return data
}

export const getAssetsSum = async () => {
	const response = await fetch("/records/assets/sum")
	const data = await response.json()
	return data
}

export const getLiabilitiesSum = async () => {
	const response = await fetch("/records/liabilities/sum")
	const data = await response.json()
	return data
}
