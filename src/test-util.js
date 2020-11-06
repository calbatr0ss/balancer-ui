import React from "react"
import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import StateReducerProvider from "./state/StateReducerProvider"
import RecordContext from "./state/record/context"
import { recordReducer } from "./state/record/reducer"

const customRender = (ui, { recordState = {}, ...renderOptions } = {}) =>
	render(ui, {
		wrapper: ({ children }) => (
			<StateReducerProvider
				Context={RecordContext}
				reducer={recordReducer}
				initialState={recordState}
			>
				{children}
			</StateReducerProvider>
		),
		...renderOptions,
	})

// re-export everything and override render method
export * from "@testing-library/react"
export { userEvent, customRender as render }
