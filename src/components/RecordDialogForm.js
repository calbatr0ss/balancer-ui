import { useState, useEffect } from "react"
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	FormControl,
	FormControlLabel,
	FormLabel,
	RadioGroup,
	Radio,
} from "@material-ui/core"

const RecordDialogForm = ({ open, handleClose, handleSubmit, form = {} }) => {
	const [type, setType] = useState(form.type || "Asset")
	const [name, setName] = useState(form.name || "")
	const [balance, setBalance] = useState(form.balance || 0)

	useEffect(() => {
		if (form.type) setType(form.type)
		if (form.name) setName(form.name)
		if (form.balance) setBalance(form.balance)
	}, [form])

	const resetState = () => {
		setType("Asset")
		setName("")
		setBalance(0)
	}

	return (
		<Dialog open={open} onClose={handleClose} onExited={resetState}>
			<DialogTitle>Create New Record</DialogTitle>
			<form
				onSubmit={(event) => {
					event.preventDefault()
					handleSubmit({ name, type, balance: parseFloat(balance) })
				}}
			>
				<DialogContent>
					<FormControl component="fieldset">
						<FormLabel component="legend">Type</FormLabel>
						<RadioGroup
							aria-label="type"
							name="type"
							value={type}
							onChange={(event) => {
								setType(event.target.value)
							}}
							row
						>
							<FormControlLabel value="Asset" control={<Radio />} label="Asset" />
							<FormControlLabel value="Liability" control={<Radio />} label="Liability" />
						</RadioGroup>
					</FormControl>
					<br />
					<TextField
						label="Name"
						inputProps={{ "data-testid": "name-field" }}
						defaultValue={name}
						onChange={(event) => {
							setName(event.target.value)
						}}
					/>
					<br />
					<TextField
						label="Balance"
						inputProps={{ step: "any", min: "0", "data-testid": "balance-field" }}
						type="number"
						placeholder="0.00"
						defaultValue={form.balance ? Math.abs(balance) : undefined}
						onChange={(event) => {
							const value = type === "Asset" ? event.target.value : `-${event.target.value}`
							setBalance(value)
						}}
					/>
				</DialogContent>
				<DialogActions>
					<div
						style={{ display: "flex", justifyContent: "space-between", flexGrow: 1, padding: 8 }}
					>
						<Button onClick={handleClose} color="primary">
							Cancel
						</Button>
						<Button type="submit" color="primary" variant="contained" disabled={!name}>
							Submit
						</Button>
					</div>
				</DialogActions>
			</form>
		</Dialog>
	)
}
export default RecordDialogForm
