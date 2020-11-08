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
		// Detect if the component has unmounted before setting state
		let mounted = true
		const fetchNet = async () => {
			setNetWorthLoading(true)
			try {
				const { value } = await getNetWorth()
				if (!mounted) return
				setNetWorth(value)
			} catch (error) {
				console.error(error)
				setNetWorth(null)
			}
			setNetWorthLoading(false)
		}
		const fetchTotalAssets = async () => {
			setTotalAssetsLoading(true)
			try {
				const { value } = await getTypeSum("asset")
				if (!mounted) return
				setTotalAssets(value)
			} catch (error) {
				console.error(error)
				setTotalAssets(null)
			}
			setTotalAssetsLoading(false)
		}
		const fetchTotalLiabilities = async () => {
			setTotalLiabilitiesLoading(true)
			try {
				const { value } = await getTypeSum("liability")
				if (!mounted) return
				setTotalLiabilities(value)
			} catch (error) {
				console.error(error)
				setTotalLiabilities(null)
			}
			setTotalLiabilitiesLoading(false)
		}

		fetchNet()
		fetchTotalAssets()
		fetchTotalLiabilities()

		return () => {
			mounted = false
		}
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
						{netWorthLoading ? (
							<CircularProgress size={20} />
						) : (
							<>{netWorth !== null ? formatAsCurrency(netWorth) : "Error"}</>
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
							<>{totalAssets !== null ? formatAsCurrency(totalAssets) : "Error"}</>
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
							<>{totalLiabilities !== null ? formatAsCurrency(totalLiabilities) : "Error"}</>
						)}
					</div>
				</div>
			</Card>
		</div>
	)
}

export default RecordsSummary
