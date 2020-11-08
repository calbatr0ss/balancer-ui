import { useState, useContext } from "react"
import { Fab } from "@material-ui/core"
import { Add as AddIcon } from "@material-ui/icons"
import RecordDialogForm from "./RecordDialogForm"
import { createRecord } from "../services/record"
import RecordContext from "../state/record/context"
import { addRecord } from "../state/record/actions"

const AddRecord = () => {
	const [open, setOpen] = useState(false)
	const [, recordDispatch] = useContext(RecordContext)

	const handleCreateSubmit = async (form) => {
		const record = { type: form.type, name: form.name, balance: parseFloat(form.balance) }
		const recordId = await createRecord(record)
		recordDispatch(addRecord({ ...record, id: recordId }))
		setOpen(false)
	}

	return (
		<>
			<div style={{ width: "100%", textAlign: "right", marginTop: 16 }}>
				<Fab
					color="primary"
					aria-label="add"
					onClick={() => {
						setOpen(true)
					}}
					data-testid="add-record-button"
				>
					<AddIcon />
				</Fab>
			</div>

			<RecordDialogForm
				open={open}
				handleClose={() => {
					setOpen(false)
				}}
				handleSubmit={handleCreateSubmit}
			/>
		</>
	)
}
export default AddRecord
