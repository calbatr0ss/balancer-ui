import React from "react"
import "./App.css"
import { Container } from "@material-ui/core"
import RecordsView from "./views/RecordsView"
import StateReducerProvider from "./state/StateReducerProvider"
import { recordReducer } from "./state/record/reducer"
import RecordContext from "./state/record/context"

function App() {
	return (
		<StateReducerProvider Context={RecordContext} reducer={recordReducer}>
			<div className="App">
				<header className="App-header">
					<Container>
						<RecordsView />
					</Container>
				</header>
			</div>
		</StateReducerProvider>
	)
}

export default App
