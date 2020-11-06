// In-memory mock of records table
export let records = {}
export let idCounter = 0
export const incrementCounter = () => idCounter++

export const clear = () => {
	records = {}
	idCounter = 0
}
