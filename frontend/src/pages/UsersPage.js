import React from 'react'
import UsersContent from "../components/users/UsersContent"
import {TheFooter, TheHeader, TheSidebar} from "../containers"

const UsersPage = () => {
    return (
        <div className="c-app c-default-layout">
            <TheSidebar/>
            <div className="c-wrapper">
                <TheHeader/>
                <div className="c-body">
                    <UsersContent/>
                </div>
                <TheFooter/>
            </div>
        </div>
    )
}

export default UsersPage