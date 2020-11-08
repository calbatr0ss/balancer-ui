import { useEffect, useState, useContext } from "react"
import {
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from "@material-ui/core"
import { Skeleton } from "@material-ui/lab"
import { Delete as DeleteIcon, Edit as EditIcon } from "@material-ui/icons"
import { getRecords, deleteRecord, editRecord } from "../services/record"
import RecordContext from "../state/record/context"
import {
	addRecord,
	deleteRecord as deleteRecordAction,
	editRecord as editRecordAction,
} from "../state/record/actions"
import { formatAsCurrency } from "../util/util"
import RecordDialogForm from "./RecordDialogForm"

const skeletonStyle = { height: 100 }

const RecordsTable = () => {
	const [rows, setRows] = useState([])
	const [editOpen, setEditOpen] = useState(false)
	const [openId, setOpenId] = useState(null)
	const [editForm, setEditForm] = useState({})
	const [loading, setLoading] = useState(false)
	const [recordState, recordDispatch] = useContext(RecordContext)

	useEffect(() => {
		// Detect if the component has unmounted before setting state
		let mounted = true
		const getRows = async () => {
			setLoading(true)
			try {
				const records = await getRecords()
				if (!mounted) return
				// Add records to context
				for (let el of records) {
					recordDispatch(addRecord(el))
				}
			} catch (error) {
				console.error(error)
				// TODO
			}
			setLoading(false)
		}

		getRows()

		return () => {
			mounted = false
		}
	}, [recordDispatch])

	useEffect(() => {
		// Format rows for table consumption
		setRows(Object.entries(recordState).map(([key, value]) => ({ ...value, id: key })))
	}, [recordState])

	const handleDelete = async (id) => {
		try {
			await deleteRecord(id)
			recordDispatch(deleteRecordAction(id))
		} catch (error) {
			console.error("Error deleting record", error)
		}
	}

	const handleEdit = (row) => {
		setEditOpen(true)
		setOpenId(row.id)
		setEditForm({ type: row.type, name: row.name, balance: row.balance })
	}

	const handleEditSubmit = async (form) => {
		try {
			await editRecord(openId, form)
			recordDispatch(editRecordAction({ ...form, id: openId }))
		} catch (error) {
			console.error("Error editing record", error)
		}
		setEditOpen(false)
	}

	return (
		<>
			<TableContainer component={Paper}>
				{loading ? (
					<div style={{ padding: "0 16px" }}>
						<Skeleton style={skeletonStyle} />
						<Skeleton style={skeletonStyle} />
						<Skeleton style={skeletonStyle} />
					</div>
				) : (
					<>
						{rows.length > 0 ? (
							<>
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell>
												<b>Type</b>
											</TableCell>
											<TableCell>
												<b>Name</b>
											</TableCell>
											<TableCell align="right">
												<b>Balance</b>
											</TableCell>
											<TableCell align="center">
												<b>Actions</b>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{rows.map((row) => (
											<TableRow key={row.id}>
												<TableCell>{row.type}</TableCell>
												<TableCell>{row.name}</TableCell>
												<TableCell
													align="right"
													data-testid={`table-row-${row.id}-balance`}
													style={{ color: row.type.toLowerCase() === "asset" ? "green" : "red" }}
												>
													{formatAsCurrency(row.balance)}
												</TableCell>
												<TableCell align="center">
													<IconButton
														onClick={() => {
															handleEdit(row)
														}}
														data-testid={`edit-${row.id}`}
													>
														<EditIcon />
													</IconButton>
													<IconButton
														onClick={() => {
															handleDelete(row.id)
														}}
														data-testid={`delete-${row.id}`}
													>
														<DeleteIcon />
													</IconButton>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</>
						) : (
							<div style={{ textAlign: "center" }}>
								<p>
									<em>Create a record to get started!</em>
								</p>
							</div>
						)}
					</>
				)}
			</TableContainer>
			<RecordDialogForm
				form={editForm}
				open={editOpen}
				handleClose={() => {
					setEditOpen(false)
				}}
				handleSubmit={handleEditSubmit}
			/>
		</>
	)
}

export default RecordsTable
