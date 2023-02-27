import React from 'react'
import { TheFooter, TheHeader, TheSidebar} from "../containers"
import OrdersContent from "../components/orders/OrdersContent"

function OrdersPage() {
    return (
        <div className="c-app c-default-layout">
            <TheSidebar/>
            <div className="c-wrapper">
                <TheHeader/>
                <div className="c-body">
                    <OrdersContent/>
                </div>
                <TheFooter/>
            </div>
        </div>
    )
}

export default OrdersPage