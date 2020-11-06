import React, { useState, useContext } from "react"
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
import { createRecord } from "../services/record"
import RecordContext from "../state/record/context"
import { addRecord } from "../state/record/actions"

const AddRecordDialog = ({ open, handleClose }) => {
	const [, recordDispatch] = useContext(RecordContext)
	const [type, setType] = useState("Asset")
	const [name, setName] = useState("")
	const [balance, setBalance] = useState(0)

	const handleSubmit = async () => {
		const record = { type, name, balance }
		const recordId = await createRecord(record)
		recordDispatch(addRecord({ ...record, id: recordId }))
		handleClose()
	}

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Create New Record</DialogTitle>
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
					onChange={(event) => {
						setName(event.target.value)
					}}
				/>
				<br />
				<TextField
					label="Balance"
					inputProps={{ "data-testid": "balance-field" }}
					type="number"
					onChange={(event) => {
						setBalance(event.target.value)
					}}
				/>
			</DialogContent>
			<DialogActions>
				<div style={{ display: "flex", justifyContent: "space-between", flexGrow: 1, padding: 8 }}>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="primary" variant="contained">
						Submit
					</Button>
				</div>
			</DialogActions>
		</Dialog>
	)
}
export default AddRecordDialog
