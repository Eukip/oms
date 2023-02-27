import {
    USER_SUCCESS,
    USER_LOADING,
    USER_FAIL,
    LOGOUT,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGIN_LOADING,
    CLEAR_ERROR,
} from "../types/authTypes"

const _baseApi = process.env.REACT_APP_BASE_API

export const loadUser = () => async (dispatch, getState) => {
    dispatch(userLoading())

    const token = getState().auth.refreshToken

    if (token){
        const result = await doRequestAndParse(`${_baseApi}/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({refresh: token})
        })

        const { hasError, data } = result

        console.log('result: ', result)

        if (hasError){
            const { detail } = data
            dispatch(userFail(detail|| 'Что-то пошло не так' ))
        } else {
            const { user, access } = data
            dispatch(userSuccess(user, access))
        }
    } else {
        dispatch(loginFail(''))
    }
}

export const login = (username, password) => async dispatch => {

    const result = await doRequestAndParse(`${_baseApi}/users/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    })

    const { hasError, data } = result

    if (hasError){
        const { detail } = data
        dispatch(loginFail(detail|| 'Что-то пошло не так' ))
    } else {
        const { user, access, refresh } = data
        dispatch(loginSuccess(user, access, refresh))
    }
}

const doRequestAndParse = async (url, options) => {
    try {
        let hasError = false

        const res = await fetch(url, options)

        if (!res.ok) {
            hasError = true
        }

        const data = await res.json()

        return { hasError, data }
    } catch (e) {
        return { hasError: true, data: { detail: e.message.toString() } }
    }
}

export const loginLoading = () => ({ type: LOGIN_LOADING })
export const loginSuccess = (user, accessToken, refreshToken) => ({ type: LOGIN_SUCCESS, payload: {user, accessToken, refreshToken} })
export const loginFail = error => ({ type: LOGIN_FAIL, payload: error })

export const userLoading = () => ({ type: USER_LOADING })
export const userSuccess = (user, accessToken) => ({ type: USER_SUCCESS, payload: {user, accessToken} })
export const userFail = error => ({ type: USER_FAIL, payload: error })

export const logout = () => ({ type: LOGOUT })

export const clearError = () => ({ type: CLEAR_ERROR })




// export const tokenConfig = getState => {
//     // Get token from localStorage
//     const token = getState().auth.access;
//
//     const config = {
//         headers: {
//             "Content-type": "application/json"
//         }
//     };
//
//     // If token, add to headers
//     if (token){
//         config.headers['Authorization'] = 'Bearer ' + token;
//     }
//
//     return config;
// };