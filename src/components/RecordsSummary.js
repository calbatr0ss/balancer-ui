import { useState, useEffect, useContext } from "react"
import { Card, CircularProgress } from "@material-ui/core"
import { getNetWorth, getTypeSum } from "../services/record"
import RecordContext from "../state/record/context"
import { formatAsCurrency } from "../util/util"

const RecordsSummary = () => {
	const [recordState] = useContext(RecordContext)

	const [netWorth, setNetWorth] = useState(0)
	const [totalAssets, setTotalAssets] = useState(0)
	const [totalLiabilities, setTotalLiabilities] = useState(0)
	const [netWorthLoading, setNetWorthLoading] = useState(false)
	const [totalAssetsLoading, setTotalAssetsLoading] = useState(false)
	const [totalLiabilitiesLoading, setTotalLiabilitiesLoading] = useState(false)

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

	return (
		<div
			style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginBottom: 8 }}
		>
			<Card
				variant="outlined"
				style={{
					minWidth: "fit-content",
					width: 300,
					padding: "0 16px",
					color: netWorth < 0 ? "red" : "green",
				}}
			>
				<div style={{ display: "flex" }}>
					<p>
						<strong>Net Worth: </strong>
					</p>
					<span style={{ flexGrow: 1 }} />
					<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
						{netWorthLoading ? <CircularProgress size={20} /> : <>$ {formatAsCurrency(netWorth)}</>}
					</div>
				</div>
			</Card>
			<Card
				variant="outlined"
				style={{
					minWidth: "fit-content",
					width: 300,
					padding: "0 16px",
					margin: "8px 0",
					color: "green",
				}}
			>
				<div style={{ display: "flex" }}>
					<p>
						<strong>Total Assets: </strong>
					</p>
					<span style={{ flexGrow: 1 }} />
					<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
						{totalAssetsLoading ? (
							<CircularProgress size={20} />
						) : (
							<>$ {formatAsCurrency(totalAssets)}</>
						)}
					</div>
				</div>
			</Card>
			<Card
				variant="outlined"
				style={{
					minWidth: "fit-content",
					width: 300,
					padding: "0 16px",
					color: "red",
				}}
			>
				<div style={{ display: "flex" }}>
					<p>
						<strong>Total Liabilities: </strong>
					</p>
					<span style={{ flexGrow: 1 }} />
					<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
						{totalLiabilitiesLoading ? (
							<CircularProgress size={20} />
						) : (
							<>$ {formatAsCurrency(totalLiabilities)}</>
						)}
					</div>
				</div>
			</Card>
		</div>
	)
}

export default RecordsSummary
