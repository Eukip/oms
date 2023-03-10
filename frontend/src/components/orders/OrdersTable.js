import React, {useContext, useState} from 'react'
import {
    CDataTable,
    CButton,
    CRow,
    CCol,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CModal,
    CLink
} from "@coreui/react"
import WSSendMessageContext from "../../context/WSSendMessageContext"
import Moment from "react-moment"
import 'moment/locale/ru'
import 'moment/locale/ky'
import {useSelector} from "react-redux"
import {
    NEW,
    CONFIRMED,
    DELIVERY_ACCEPTED,
    DELIVERY_DONE,
    DELIVERY_REJECTED,
    DELIVERY_RETURNED,
    PRINTED,
    PROCESSING,
    REJECTED,
    RETURNED,
    SEND
} from './statuses'
import OrderForm from "./OrderForm"

function OrdersTable({ orders }) {
    const sendMessage = useContext(WSSendMessageContext)
    const user = useSelector(state => state.auth.user)

    const [currentOrder, setCurrentOrder] = useState(null)
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
    const [isFormDisabled, setIsFormDisabled] = useState(false)

    const openOrderModal = order => {
        setCurrentOrder(order)
        setIsOrderModalOpen(true)
    }

    const closeOrderModal = () => {
        setIsFormDisabled(false)
        setCurrentOrder(null)
        setIsOrderModalOpen(false)
    }

    const onOpenOrder = order => {
        openOrderModal(order)
    }

    const updateStatus = (id, status) => {
        const doc = { type: 'update', data: { id, status } }
        console.log('websocket sending message: ', doc)
        sendMessage && sendMessage(JSON.stringify(doc))
    }

    const onTakeToProcess = order => {
        updateStatus(order.id, PROCESSING)
        openOrderModal(order)
    }

    const onCancelProcessing = id => {
        updateStatus(id, NEW)
    }

    const onReject = id => {
        updateStatus(id, REJECTED)
        closeOrderModal()
    }

    const onConfirm = id => {
        updateStatus(id, CONFIRMED)
        closeOrderModal()
    }

    const onReturnToCallCenter = id => {
        updateStatus(id, RETURNED)
    }

    const onSendToDelivery = id => {
        updateStatus(id, SEND)
    }

    const onPrint = id => {
        updateStatus(id, PRINTED)
    }

    const actions = {
        onTakeToProcess,
        onReject,
        onOpenOrder,
        onCancelProcessing,
        onReturnToCallCenter,
        onSendToDelivery,
        onPrint
    }

    const onOrderOwnerNameClick = order => {
        setIsFormDisabled(true)
        openOrderModal(order)
    }

    return (
       <>
           <CDataTable
               items={orders}
               fields={fields}
               columnFilter
               tableFilter
               footer
               hover
               sorter
               size="md"
               scopedSlots = {{
                   'fullname':
                       (item)=>(
                           <td>
                               <CLink onClick={() => onOrderOwnerNameClick(item)}>
                                   {item.fullname}
                               </CLink>
                           </td>
                       ),
                   'created_at':
                       (item)=>(
                           <td>
                               {getPastTime(item.created_at)}
                           </td>
                       ),
                   'phone':
                       (item)=>(
                           <td>
                               {item.phone}
                           </td>
                       ),
                   // 'email':
                   //     (item)=>(
                   //         <td>
                   //             {item.email}
                   //         </td>
                   //     ),
                   'address':
                       (item)=>(
                           <td>
                               {`${item.city}, ${item.address}`}
                           </td>
                       ),
                   'status_text':
                       (item)=>(
                           <td>
                               {
                                   item.status === 1 ?
                                       ( item.processing_by && item.processing_by === user.id ?
                                           `???????????????????????????? ????????` :
                                           `???????????????????????? ${user.first_name} ${user.last_name}`
                                       ) : item.status_text

                               }
                           </td>
                       ),
                   'actions':
                       (item)=>(
                           <td>
                               { getButton(user, item, actions) }
                           </td>
                       ),
               }}
           />
           { currentOrder && <OrderForm
               isOrderModalOpen={isOrderModalOpen}
               order={currentOrder}
               onConfirm={onConfirm}
               onReject={onReject}
               closeOrderModal={closeOrderModal}
               isFormDisabled={isFormDisabled}
           /> }
       </>
    )
}

const getButton = (user, item, actions) => {

    //   ??????????????
    //     0: '??????????',
    //     1: '?? ??????????????????',
    //     2: '??????????????',
    //     3: '??????????????????????',
    //     10: '?????????????? ?? ????????-??????????',
    //     11: '???????????????????? ???? ????????????',
    //     12: '????????????????????, ???????????? ???? ????????????????',
    //     20: '???????????? ???? ????????????????',
    //     21: '???????????????? ????????????????',
    //     22: '???? ????????????????????',
    //     23: '????????????????????'

    switch (item.status){
        case 0:
        case 10:
            if (user.role === 3){
                return <CButton size="sm" color="primary" onClick={() => actions.onTakeToProcess(item)}>?????????? ?? ??????????????????</CButton>
            } else {
                return '-'
            }
        case 1:
            if (user.role === 3){
                if (item.processing_by && user.id === item.processing_by){
                    return <div className="d-flex justify-content-between">
                        <CButton size="sm" color="info" onClick={() => actions.onOpenOrder(item)}>?????????????? ????????????</CButton>
                        <CButton size="sm" color="warning" onClick={() => actions.onCancelProcessing(item.id)}>???????????????? ??????????????????</CButton>
                    </div>
                } else {
                    return '-'
                }
            }
            return '-'
        case 2:
            return '-'
        case 3:
            if (user.role === 2){
                return <div className="d-flex justify-content-between">
                    <CButton size="sm" color="warning" onClick={() => actions.onReturnToCallCenter(item.id)}>???????????????????? ?? ????????-??????????</CButton>
                    <CButton size="sm" color="success" className="ml-3" onClick={() => actions.onSendToDelivery(item.id)}>?????????????????? ???? ????????????</CButton>
                </div>
            }
            return '-'
        case 11:
            if (user.role === 2){
                return <CButton size="sm" color="success" onClick={() => actions.onPrint(item.id)}>????????????????????</CButton>
            }
            return '-'
        case 12:

        case 20:

        case 21:

        case 22:

        case 23:

    }

    return '-'
}

const fields = [
    { key: 'fullname', label: '??????' },
    { key: 'created_at', label: '???????? ???????????????? ????????????' },
    { key: 'phone', label: '?????????? ????????????????' },
    // { key: 'email', label: 'Email' },
    { key: 'address', label: '?????????? ????????????????' },
    { key: 'status_text', label: '????????????', _style: { width: '20%' } },
    {
        key: 'actions',
        label: '????????????????',
        _style: { width: '22%' },
        sorter: false,
        filter: false
    }
]

const getPastTime = (createdAt) => {
    return <span><Moment locale='ru' fromNow ago>{createdAt}</Moment> ??????????</span>
}

// Table field example
// {
//     key: 'show_details',
//         label: '',
//     _style: { width: '1%' },
//     sorter: false,
//         filter: false
// }

export default OrdersTable