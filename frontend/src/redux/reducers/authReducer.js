import {
    USER_SUCCESS,
    USER_LOADING,
    USER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    LOGIN_LOADING,
    CLEAR_ERROR,
} from '../types/authTypes'

const initialState = {
    accessToken: localStorage.getItem('access_token_optima'),
    refreshToken: localStorage.getItem('refresh_token_optima'),
    isAuthenticated: false,
    user: null,
    error: null,
    isUserLoading: true,
    isLoginLoading: false
}

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isUserLoading: true,
                isAuthenticated: true,
                error: null
            }
        case LOGIN_LOADING:
            return {
                ...state,
                isLoginLoading: true,
                error: null
            }
        case USER_SUCCESS:
            localStorage.setItem('access_token_optima', action.payload.accessToken)
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                accessToken: action.payload.accessToken,
                isUserLoading: false,
                error: null
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('access_token_optima', action.payload.accessToken)
            localStorage.setItem('refresh_token_optima', action.payload.refreshToken)
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
                isLoginLoading: false,
                error: null
            }
        case USER_FAIL:
        case LOGIN_FAIL:
        case LOGOUT:
            localStorage.removeItem('access_token_optima')
            localStorage.removeItem('refresh_token_optima')
            return {
                ...state,
                accessToken: null,
                refreshToken: null,
                user: null,
                isAuthenticated: false,
                isLoginLoading: false,
                isUserLoading: false,
                error: action.payload || null
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            }
        default:
            return {
                ...state
            }
    }
}