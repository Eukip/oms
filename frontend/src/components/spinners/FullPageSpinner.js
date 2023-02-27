import React from 'react'
import {CSpinner} from "@coreui/react"

const FullPageSpinner = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <CSpinner color="info"/>
    </div>
)

export default FullPageSpinner