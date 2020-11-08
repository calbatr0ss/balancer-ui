// Return string from number with formatting $123,456.78
export const formatAsCurrency = (num) => {
	return `${num < 0 ? "- " : ""}$${Math.abs(num)
		.toFixed(2)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}
