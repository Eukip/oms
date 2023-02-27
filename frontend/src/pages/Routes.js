import React from 'react'
import {Redirect, Route, Switch} from "react-router-dom"
import PrivateRoute from "../containers/PrivateRoute"
import FullPageSpinner from "../components/spinners/FullPageSpinner"
import ErrorBoundary from "../components/ErrorBoundary"

const LoginPage = React.lazy(() => import('./LoginPage'))
const OrdersPage = React.lazy(() => import('./OrdersPage'))
const UsersPage = React.lazy(() => import('./UsersPage'))
const BranchesPage = React.lazy(() => import('./BranchesPage'))
const Page404 = React.lazy(() => import('./Page404'))

function Routes() {
    return (
        <React.Suspense fallback={<FullPageSpinner/>}>
            <Switch>
                <Route exact path="/login">
                    <ErrorBoundary>
                        <LoginPage/>
                    </ErrorBoundary>
                </Route>
                <PrivateRoute exact path="/orders">
                    <ErrorBoundary>
                        <OrdersPage/>
                    </ErrorBoundary>
                </PrivateRoute>
                <PrivateRoute exact path="/order/:id">
                    <ErrorBoundary>
                        <OrdersPage/>
                    </ErrorBoundary>
                </PrivateRoute>
                <PrivateRoute exact path="/users">
                    <ErrorBoundary>
                        <UsersPage/>
                    </ErrorBoundary>
                </PrivateRoute>
                <PrivateRoute exact path="/branches">
                    <ErrorBoundary>
                        <BranchesPage/>
                    </ErrorBoundary>
                </PrivateRoute>
                <Route exact path="/" >
                    <Redirect to="/orders" />
                </Route>
                <Route>
                    <Page404/>
                </Route>
            </Switch>
        </React.Suspense>
    )
}

export default Routes