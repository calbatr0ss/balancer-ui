import React, { useEffect, useState, useContext } from "react"
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
import { Delete as DeleteIcon } from "@material-ui/icons"
import { getRecords, deleteRecord, getSum } from "../services/record"
import RecordContext from "../state/record/context"
import { addRecord, deleteRecord as deleteRecordAction } from "../state/record/actions"

const skeletonStyle = { height: 100 }

const RecordTable = () => {
	const [rows, setRows] = useState([])
	const [recordSum, setRecordSum] = useState([])
	const [loading, setLoading] = useState(false)
	const [calcLoading, setCalcLoading] = useState(false)
	const [recordState, recordDispatch] = useContext(RecordContext)

	useEffect(() => {
		const getRows = async () => {
			setLoading(true)
			try {
				const records = await getRecords()
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
	}, [recordDispatch])

	useEffect(() => {
		const fetchSum = async () => {
			setCalcLoading(true)
			try {
				const { sum } = await getSum()
				setRecordSum(sum)
			} catch (error) {
				console.error(error)
				// TODO
			}
			setCalcLoading(false)
		}

		fetchSum()
	}, [recordState])

	useEffect(() => {
		// Format rows for table consumption
		setRows(Object.entries(recordState).map(([key, value]) => ({ ...value, id: key })))
	}, [recordState])

	const handleDelete = async (id) => {
		await deleteRecord(id)
		recordDispatch(deleteRecordAction(id))
	}

	return (
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
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>
											<b>Type</b>
										</TableCell>
										<TableCell>
											<b>Name</b>
										</TableCell>
										<TableCell>
											<b>Balance</b>
										</TableCell>
										<TableCell>
											<b>Actions</b>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{rows.map((row) => (
										<TableRow key={row.id}>
											<TableCell>{row.type}</TableCell>
											<TableCell>{row.name}</TableCell>
											<TableCell>{row.balance}</TableCell>
											<TableCell>
												<IconButton
													data-testid={`delete-${row.id}`}
													onClick={() => {
														handleDelete(row.id)
													}}
												>
													<DeleteIcon />
												</IconButton>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							{calcLoading ? (
								<Skeleton />
							) : (
								<TableRow>
									<TableCell>Total</TableCell>
									<TableCell />
									<TableCell>{recordSum}</TableCell>
								</TableRow>
							)}
						</>
					) : (
						<p>
							<em>Create a record to get started!</em>
						</p>
					)}
				</>
			)}
		</TableContainer>
	)
}

export default RecordTable
