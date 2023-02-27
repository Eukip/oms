import React from 'react'
import {TheFooter, TheHeader, TheSidebar} from "../containers"
import BranchesContent from "../components/branches/BranchesContent";

const BranchesPage = () => {
    return (
        <div className="c-app c-default-layout">
            <TheSidebar/>
            <div className="c-wrapper">
                <TheHeader/>
                <div className="c-body">
                    <BranchesContent/>
                </div>
                <TheFooter/>
            </div>
        </div>
    )
}

export default BranchesPage