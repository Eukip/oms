import {SET, TOGGLE_SOUND} from "../types/settingTypes"

export const set = sidebarShow => ({ type: SET, payload: sidebarShow })

export const toggleSound = () => ({ type: TOGGLE_SOUND })