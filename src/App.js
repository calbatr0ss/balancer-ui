import React from "react"
import "./App.css"
import { AppBar, Container, Toolbar } from "@material-ui/core"
import RecordsView from "./views/RecordsView"
import StateReducerProvider from "./state/StateReducerProvider"
import { recordReducer } from "./state/record/reducer"
import RecordContext from "./state/record/context"

function App() {
	return (
		<StateReducerProvider Context={RecordContext} reducer={recordReducer}>
			<div className="container">
				<AppBar position="static">
					<Toolbar>
						<h3 style={{ margin: 0 }}>Balancer</h3>
					</Toolbar>
				</AppBar>
				<Container maxWidth="md" style={{ margin: "24px 0" }}>
					<RecordsView />
				</Container>
			</div>
		</StateReducerProvider>
	)
}

export default App
