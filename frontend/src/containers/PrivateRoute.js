import React from "react"
import { Route, Redirect } from "react-router-dom"
import { useSelector } from "react-redux"

const PrivateRoute = ({ children, ...remainingProps }) => {

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

    return (
        <Route
            {...remainingProps}
            render={({ location }) =>
                isAuthenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    )
}
export default PrivateRoute