import React, { useReducer } from "react"

const StateReducerProvider = ({ Context, reducer, initialState = {}, children }) => (
	<Context.Provider value={useReducer(reducer, initialState)}>{children}</Context.Provider>
)

export default StateReducerProvider
