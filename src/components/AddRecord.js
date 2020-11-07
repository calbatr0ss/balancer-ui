import { useState } from "react"
import { Fab } from "@material-ui/core"
import { Add as AddIcon } from "@material-ui/icons"
import AddRecordDialog from "./AddRecordDialog"

const AddRecord = () => {
	const [open, setOpen] = useState(false)

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

			<AddRecordDialog
				open={open}
				handleClose={() => {
					setOpen(false)
				}}
			/>
		</>
	)
}
export default AddRecord
