import {SET, TOGGLE_SOUND} from "../types/settingTypes"

const initialState = {
    sidebarShow: 'responsive',
    isSoundOn: false
}

export default function settingReducer(state = initialState, action){
    switch (action.type) {
        case SET:
            return {...state, sidebarShow: action.payload }
        case TOGGLE_SOUND:
            return {...state, isSoundOn: !state.isSoundOn}
        default:
            return state
    }
}