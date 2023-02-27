import {ADD_ORDER, SAVE_ORDERS, UPDATE_ORDER} from "../types/ordersTypes"

export const saveOrders = orders => {
    return {
        type: SAVE_ORDERS,
        payload: orders
    }
}

export const updateOrder = (id, order) => {
    return {
        type: UPDATE_ORDER,
        payload: {id, order}
    }
}

export const addOrder = order => {
    return {
        type: ADD_ORDER,
        payload: order
    }
}