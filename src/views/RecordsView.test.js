import { render, screen, cleanup, userEvent, waitFor } from "../test-util"
import RecordsView from "./RecordsView"

afterEach(() => {
	cleanup()
})

test("should allow cancellation of new record form", async () => {
	render(<RecordsView />)

	await waitFor(() =>
		expect(screen.getByText(/create a record to get started/i)).toBeInTheDocument()
	)

	userEvent.click(screen.getByTestId("add-record-button"))

	expect(screen.getByText(/create new record/i)).toBeInTheDocument()

	userEvent.click(screen.getByText(/cancel/i))

	// Modal closes
	await waitFor(() => expect(screen.queryByText(/create new record/i)).not.toBeInTheDocument())
})

test("should add an asset record", async () => {
	render(<RecordsView />)

	await waitFor(() =>
		expect(screen.getByText(/create a record to get started/i)).toBeInTheDocument()
	)

	userEvent.click(screen.getByTestId("add-record-button"))

	expect(screen.getByText(/create new record/i)).toBeInTheDocument()
	expect(screen.getByRole("radio", { name: "Asset" })).toBeChecked()
	expect(screen.getByRole("radio", { name: "Liability" })).not.toBeChecked()

	const entryName = "Test Asset"
	const entryBalance = "100.50"
	userEvent.type(screen.getByTestId("name-field"), entryName)
	userEvent.type(screen.getByTestId("balance-field"), entryBalance)
	userEvent.click(screen.getByText(/submit/i))

	// Modal closes
	await waitFor(() => expect(screen.queryByText(/create new record/i)).not.toBeInTheDocument())
	// Table updates
	expect(screen.queryByText(/create a record to get started/i)).not.toBeInTheDocument()
	expect(screen.getByText(entryName)).toBeInTheDocument()
	expect(screen.getByTestId("table-row-0-balance").textContent).toBe(`$${entryBalance}`)
})

test("should add a liability record", async () => {
	render(<RecordsView />)

	await waitFor(() =>
		expect(screen.getByText(/create a record to get started/i)).toBeInTheDocument()
	)

	userEvent.click(screen.getByTestId("add-record-button"))

	expect(screen.getByText(/create new record/i)).toBeInTheDocument()

	userEvent.click(screen.getByText("Liability"))

	expect(screen.getByRole("radio", { name: "Liability" })).toBeChecked()
	expect(screen.getByRole("radio", { name: "Asset" })).not.toBeChecked()

	const entryName = "Test Liability"
	const entryBalance = "100.50"
	userEvent.type(screen.getByTestId("name-field"), entryName)
	userEvent.type(screen.getByTestId("balance-field"), entryBalance)
	userEvent.click(screen.getByText(/submit/i))

	// Modal closes
	await waitFor(() => expect(screen.queryByText(/create new record/i)).not.toBeInTheDocument())
	// Table updates
	expect(screen.queryByText(/create a record to get started/i)).not.toBeInTheDocument()
	expect(screen.getByText(entryName)).toBeInTheDocument()
	expect(screen.getByTestId("table-row-0-balance").textContent).toBe(`- $${entryBalance}`)
})

test("should delete a record", async () => {
	render(<RecordsView />)

	// Create new liability
	userEvent.click(screen.getByTestId("add-record-button"))
	userEvent.click(screen.getByRole("radio", { name: "Liability" }))
	const liabilityName = "Test Liability"
	const liabilityBalance = "-100.50"
	userEvent.type(screen.getByTestId("name-field"), liabilityName)
	userEvent.type(screen.getByTestId("balance-field"), liabilityBalance)
	userEvent.click(screen.getByText(/submit/i))
	await waitFor(() => expect(screen.queryByText(/create new record/i)).not.toBeInTheDocument())

	// Create new asset
	userEvent.click(screen.getByTestId("add-record-button"))
	userEvent.click(screen.getByRole("radio", { name: "Asset" }))
	const assetName = "Test Asset"
	const assetBalance = "100.50"
	userEvent.type(screen.getByTestId("name-field"), assetName)
	userEvent.type(screen.getByTestId("balance-field"), assetBalance)
	userEvent.click(screen.getByText(/submit/i))
	await waitFor(() => expect(screen.queryByText(/create new record/i)).not.toBeInTheDocument())

	await waitFor(() => expect(screen.getByText(assetName)).toBeInTheDocument())
	await waitFor(() => expect(screen.getByText(liabilityName)).toBeInTheDocument())

	userEvent.click(screen.getByTestId("delete-1"))

	// Verify liability exists but asset was removed
	await waitFor(() => expect(screen.queryByText(assetName)).not.toBeInTheDocument())
	expect(screen.queryByText(liabilityName)).toBeInTheDocument()
})

test("should display net worth", async () => {
	render(<RecordsView />)

	// Create new liability
	userEvent.click(screen.getByTestId("add-record-button"))
	userEvent.click(screen.getByRole("radio", { name: "Liability" }))
	const liabilityName = "Test Liability"
	const liabilityBalance = "100.50"
	userEvent.type(screen.getByTestId("name-field"), liabilityName)
	userEvent.type(screen.getByTestId("balance-field"), liabilityBalance)
	userEvent.click(screen.getByText(/submit/i))
	await waitFor(() => expect(screen.queryByText(/create new record/i)).not.toBeInTheDocument())

	// Create new asset
	userEvent.click(screen.getByTestId("add-record-button"))
	userEvent.click(screen.getByRole("radio", { name: "Asset" }))
	const assetName = "Test Asset"
	const assetBalance = "100.25"
	userEvent.type(screen.getByTestId("name-field"), assetName)
	userEvent.type(screen.getByTestId("balance-field"), assetBalance)
	userEvent.click(screen.getByText(/submit/i))
	await waitFor(() => expect(screen.queryByText(/create new record/i)).not.toBeInTheDocument())

	expect(screen.getByText("- $0.25")).toBeInTheDocument()
})

test("should display assets sum", async () => {
	render(<RecordsView />)

	// Create new liability
	userEvent.click(screen.getByTestId("add-record-button"))
	userEvent.click(screen.getByRole("radio", { name: "Liability" }))
	const liabilityName = "Test Liability"
	const liabilityBalance = "0.75"
	userEvent.type(screen.getByTestId("name-field"), liabilityName)
	userEvent.type(screen.getByTestId("balance-field"), liabilityBalance)
	userEvent.click(screen.getByText(/submit/i))
	await waitFor(() => expect(screen.queryByText(/create new record/i)).not.toBeInTheDocument())

	// Create new asset
	userEvent.click(screen.getByTestId("add-record-button"))
	userEvent.click(screen.getByRole("radio", { name: "Asset" }))
	let assetName = "Test Asset"
	let assetBalance = "100.25"
	userEvent.type(screen.getByTestId("name-field"), assetName)
	userEvent.type(screen.getByTestId("balance-field"), assetBalance)
	userEvent.click(screen.getByText(/submit/i))
	await waitFor(() => expect(screen.queryByText(/create new record/i)).not.toBeInTheDocument())

	// Create another new asset
	userEvent.click(screen.getByTestId("add-record-button"))
	userEvent.click(screen.getByRole("radio", { name: "Asset" }))
	assetName = "Test Asset"
	assetBalance = "100.50"
	userEvent.type(screen.getByTestId("name-field"), assetName)
	userEvent.type(screen.getByTestId("balance-field"), assetBalance)
	userEvent.click(screen.getByText(/submit/i))
	await waitFor(() => expect(screen.queryByText(/create new record/i)).not.toBeInTheDocument())

	expect(screen.getByText("$200.75")).toBeInTheDocument()
})

test("should display liabilities sum", async () => {
	render(<RecordsView />)

	// Create new liability
	userEvent.click(screen.getByTestId("add-record-button"))
	userEvent.click(screen.getByRole("radio", { name: "Liability" }))
	let liabilityName = "Test Liability"
	let liabilityBalance = "100.50"
	userEvent.type(screen.getByTestId("name-field"), liabilityName)
	userEvent.type(screen.getByTestId("balance-field"), liabilityBalance)
	userEvent.click(screen.getByText(/submit/i))
	await waitFor(() => expect(screen.queryByText(/create new record/i)).not.toBeInTheDocument())

	// Create another new liability
	userEvent.click(screen.getByTestId("add-record-button"))
	userEvent.click(screen.getByRole("radio", { name: "Liability" }))
	liabilityName = "Test Liability 2"
	liabilityBalance = "3.50"
	userEvent.type(screen.getByTestId("name-field"), liabilityName)
	userEvent.type(screen.getByTestId("balance-field"), liabilityBalance)
	userEvent.click(screen.getByText(/submit/i))
	await waitFor(() => expect(screen.queryByText(/create new record/i)).not.toBeInTheDocument())

	// Create new asset
	userEvent.click(screen.getByTestId("add-record-button"))
	userEvent.click(screen.getByRole("radio", { name: "Asset" }))
	const assetName = "Test Asset"
	const assetBalance = "100.25"
	userEvent.type(screen.getByTestId("name-field"), assetName)
	userEvent.type(screen.getByTestId("balance-field"), assetBalance)
	userEvent.click(screen.getByText(/submit/i))
	await waitFor(() => expect(screen.queryByText(/create new record/i)).not.toBeInTheDocument())

	expect(screen.getByText("- $104.00")).toBeInTheDocument()
})

test("should edit an entry", async () => {
	render(<RecordsView />)

	// Create new liability
	userEvent.click(screen.getByTestId("add-record-button"))
	userEvent.click(screen.getByRole("radio", { name: "Liability" }))
	let liabilityName = "Test Liability"
	let liabilityBalance = "100.50"
	userEvent.type(screen.getByTestId("name-field"), liabilityName)
	userEvent.type(screen.getByTestId("balance-field"), liabilityBalance)
	userEvent.click(screen.getByText(/submit/i))
	await waitFor(() => expect(screen.queryByText(/create new record/i)).not.toBeInTheDocument())

	// Edit the entry
	userEvent.click(screen.getByTestId("edit-0"))
	const updatedName = "Updated Name"
	const updatedBalance = "23.40"
	userEvent.click(screen.getByRole("radio", { name: "Asset" }))
	userEvent.clear(screen.getByTestId("name-field"))
	userEvent.type(screen.getByTestId("name-field"), updatedName)
	userEvent.clear(screen.getByTestId("balance-field"))
	userEvent.type(screen.getByTestId("balance-field"), updatedBalance)
	userEvent.click(screen.getByText(/submit/i))
	await waitFor(() => expect(screen.queryByText(/create new record/i)).not.toBeInTheDocument())

	// Ensure the update was successful
	expect(screen.getByText("Asset")).toBeInTheDocument()
	expect(screen.getByText(updatedName)).toBeInTheDocument()
	expect(screen.getAllByText("$23.40")).toHaveLength(3)
})
