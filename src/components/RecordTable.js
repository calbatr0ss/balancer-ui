import React, { useEffect, useState, useContext } from "react"
import {
	CircularProgress,
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
import { getRecords, deleteRecord, getNetWorth, getTypeSum } from "../services/record"
import RecordContext from "../state/record/context"
import { addRecord, deleteRecord as deleteRecordAction } from "../state/record/actions"

const skeletonStyle = { height: 100 }

const formatAsCurrency = (num) => {
	return Number(num).toFixed(2).toLocaleString()
}

const RecordTable = () => {
	const [rows, setRows] = useState([])
	const [netWorth, setNetWorth] = useState(0)
	const [totalAssets, setTotalAssets] = useState(0)
	const [totalLiabilities, setTotalLiabilities] = useState(0)
	const [loading, setLoading] = useState(false)
	const [netWorthLoading, setNetWorthLoading] = useState(false)
	const [totalAssetsLoading, setTotalAssetsLoading] = useState(false)
	const [totalLiabilitiesLoading, setTotalLiabilitiesLoading] = useState(false)
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
		const fetchNet = async () => {
			setNetWorthLoading(true)
			try {
				const { value } = await getNetWorth()
				setNetWorth(value)
			} catch (error) {
				console.error(error)
				// TODO
			}
			setNetWorthLoading(false)
		}
		const fetchTotalAssets = async () => {
			setTotalAssetsLoading(true)
			try {
				const { value } = await getTypeSum("asset")
				setTotalAssets(value)
			} catch (error) {
				console.error(error)
				// TODO
			}
			setTotalAssetsLoading(false)
		}
		const fetchTotalLiabilities = async () => {
			setTotalLiabilitiesLoading(true)
			try {
				const { value } = await getTypeSum("liability")
				setTotalLiabilities(value)
			} catch (error) {
				console.error(error)
				// TODO
			}
			setTotalLiabilitiesLoading(false)
		}

		fetchNet()
		fetchTotalAssets()
		fetchTotalLiabilities()
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
											<TableCell data-testid={`table-row-${row.id}-balance`}>
												$ {formatAsCurrency(row.balance)}
											</TableCell>
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
							<Paper>
								<TableCell>
									{netWorthLoading ? (
										<CircularProgress />
									) : (
										<>Net Worth: $ {formatAsCurrency(netWorth)}</>
									)}
								</TableCell>
								<TableCell>
									{totalAssetsLoading ? (
										<CircularProgress />
									) : (
										<>Total Assets: $ {formatAsCurrency(totalAssets)}</>
									)}
								</TableCell>
								<TableCell>
									{totalLiabilitiesLoading ? (
										<CircularProgress />
									) : (
										<>Total Liabilities: $ {formatAsCurrency(totalLiabilities)}</>
									)}
								</TableCell>
							</Paper>
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
