import {combineReducers} from "redux"
import ordersReducer from "./ordersReducer"
import authReducer from "./authReducer"
import settingReducer from "./settingReducer"

export default combineReducers({
    setting: settingReducer,
    orders: ordersReducer,
    auth: authReducer
})