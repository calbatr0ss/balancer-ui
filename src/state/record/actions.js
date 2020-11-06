export const ADD_RECORD = "ADD_RECORD"
export const addRecord = (record) => ({
	type: ADD_RECORD,
	payload: {
		recordId: record.id,
		record: { type: record.type, name: record.name, balance: record.balance },
	},
})

export const DELETE_RECORD = "DELETE_RECORD"
export const deleteRecord = (recordId) => ({
	type: DELETE_RECORD,
	payload: { recordId },
})
