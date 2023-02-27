import {SAVE_ORDERS, UPDATE_ORDER, ADD_ORDER} from '../types/ordersTypes'

const initialState = {
    orders: [],
    isLoading: false
}

export default function ordersReducer(state = initialState, action){
    switch (action.type) {
        case SAVE_ORDERS:
            return {
                ...state,
                orders: action.payload,
                isLoading: false
            }
        case UPDATE_ORDER:
            const idx = state.orders.findIndex(el => el.id === action.payload.id)

            const before = state.orders.slice(0, idx)
            const after = state.orders.slice(idx + 1)

            return {
                ...state,
                orders: [...before, {...action.payload.order}, ...after]
            }
        case ADD_ORDER:
            return {
                ...state,
                orders: [action.payload, ...state.orders]
            }
        default:
            return {...state}
    }
}