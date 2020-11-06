import { ADD_RECORD, DELETE_RECORD } from "./actions"

export const recordReducer = (state, action) => {
	switch (action.type) {
		case ADD_RECORD:
			return { ...state, [action.payload.recordId]: action.payload.record }
		case DELETE_RECORD:
			delete state[action.payload.recordId]
			return { ...state }
		default:
			return { ...state }
	}
}
