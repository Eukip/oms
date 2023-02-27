import React from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow
} from '@coreui/react'
import OrdersTabs from "./OrdersTabs"

function OrdersContent() {
    return (
        <CRow>
            <CCol xs={12}>
                <CCard>
                    <CCardHeader>
                        Система управления заказами
                    </CCardHeader>
                    <CCardBody>
                        <OrdersTabs/>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default OrdersContent