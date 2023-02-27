import React, { useState, useContext } from 'react'
import {
    CTabs,
    CNavItem,
    CNav,
    CNavLink,
    CTabContent,
    CTabPane,
} from '@coreui/react'
import OrdersTable from "./OrdersTable"
import {useSelector} from "react-redux"

function OrdersTabs() {

    const orders = useSelector(state => state.orders.orders)

    return (
        <>
            <CTabs activeTab="all">
                <CNav variant="tabs">
                    <CNavItem>
                        <CNavLink data-tab="all">
                            Все
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink data-tab="new">
                            Новые
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink data-tab="in-progress">
                            В обработке
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink data-tab="confirmed">
                            Подтвержденные
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink data-tab="rejected">
                            Отказанные
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink data-tab="returned">
                            Возвращенные в колл-центр
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink data-tab="sent-to-print">
                            Отправленные на выпуск
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink data-tab="printed">
                            Напечатанные, выданные на доставку
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink data-tab="confirmed-to-delivery">
                            Принятые на доставку
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink data-tab="rejected-to-delivery">
                            Отказанные на доставку
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink data-tab="delivered">
                            Доставленные
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink data-tab="not-delivered">
                            Не доставленные
                        </CNavLink>
                    </CNavItem>
                </CNav>
                <CTabContent>
                    <CTabPane data-tab="all">
                        <OrdersTable
                            orders={orders.map(o => ({ ...o, _classes: getRowClassByStatus(o.status) }))}
                        />
                    </CTabPane>
                    <CTabPane data-tab="new">
                        <OrdersTable
                            orders={orders.filter(o => o.status === 0).map(o => ({ ...o, _classes: getRowClassByStatus(o.status) }))}
                        />
                    </CTabPane>
                    <CTabPane data-tab="in-progress">
                        <OrdersTable
                            orders={orders.filter(o => o.status === 1).map(o => ({ ...o, _classes: getRowClassByStatus(o.status) }))}
                        />
                    </CTabPane>
                    <CTabPane data-tab="confirmed">
                        <OrdersTable
                            orders={orders.filter(o => o.status === 3).map(o => ({ ...o, _classes: getRowClassByStatus(o.status) }))}
                        />
                    </CTabPane>
                    <CTabPane data-tab="rejected">
                        <OrdersTable
                            orders={orders.filter(o => o.status === 2).map(o => ({ ...o, _classes: getRowClassByStatus(o.status) }))}
                        />
                    </CTabPane>
                    <CTabPane data-tab="returned">
                        <OrdersTable
                            orders={orders.filter(o => o.status === 10).map(o => ({ ...o, _classes: getRowClassByStatus(o.status) }))}
                        />
                    </CTabPane>
                    <CTabPane data-tab="sent-to-print">
                        <OrdersTable
                            orders={orders.filter(o => o.status === 11).map(o => ({ ...o, _classes: getRowClassByStatus(o.status) }))}
                        />
                    </CTabPane>
                    <CTabPane data-tab="printed">
                        <OrdersTable
                            orders={orders.filter(o => o.status === 12).map(o => ({ ...o, _classes: getRowClassByStatus(o.status) }))}
                        />
                    </CTabPane>
                    <CTabPane data-tab="confirmed-to-delivery">
                        <OrdersTable
                            orders={orders.filter(o => o.status === 20).map(o => ({ ...o, _classes: getRowClassByStatus(o.status) }))}
                        />
                    </CTabPane>
                    <CTabPane data-tab="rejected-to-delivery">
                        <OrdersTable
                            orders={orders.filter(o => o.status === 21).map(o => ({ ...o, _classes: getRowClassByStatus(o.status) }))}
                        />
                    </CTabPane>
                    <CTabPane data-tab="delivered">
                        <OrdersTable
                            orders={orders.filter(o => o.status === 22).map(o => ({ ...o, _classes: getRowClassByStatus(o.status) }))}
                        />
                    </CTabPane>
                    <CTabPane data-tab="not-delivered">
                        <OrdersTable
                            orders={orders.filter(o => o.status === 23).map(o => ({ ...o, _classes: getRowClassByStatus(o.status) }))}
                        />
                    </CTabPane>
                </CTabContent>
            </CTabs>
        </>
    );
}

const getRowClassByStatus = status => {
    switch (status){
        case 0:
            return 'row-bg-yellow'
        case 1:
            return 'row-bg-blue'
        case 3:
            return 'row-bg-green'
        default:
            return 'row-bg-white'
    }
}

export default OrdersTabs