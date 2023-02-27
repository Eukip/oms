export default class OptimaService{
    _baseApi = process.env.REACT_APP_BASE_API

    login = async (username, password) => {

        let hasError = false

        try {
            const res = await fetch(`${this._baseApi}/users/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            })

            if (!res.ok) {
                hasError = true
            }

            const data = await res.json()

            return { hasError, data }

        } catch (e) {
            return { hasError: true, data: e.message.toString() }
        }
    }

    createBranch = async (city, address) => {
        return await this.doRequestAndParse(`${this._baseApi}/branches/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getAccessToken()
            },
            body: JSON.stringify({ city, address })
        })
    }

    updateBranch = async (id, city, address) => {
        return await this.doRequestAndParse(`${this._baseApi}/branches/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getAccessToken()
            },
            body: JSON.stringify({ city, address })
        })
    }

    deleteBranch = async id => {
        const res = await fetch(`${this._baseApi}/branches/${id}/`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + getAccessToken() }
        })

        if (!res.ok){
            return { hasError: true, data: { detail: 'Произошла ошибка при удалении филиала' } }
        } else {
            return { hasError: false, data: { detail: 'Филиал успешно удален из списка' } }
        }
    }

    getBranches = async () => {
        return this.doRequestAndParse(`${this._baseApi}/branches/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getAccessToken()
            }
        })
    }

    createUser = async (first_name, last_name, username, email, password, role, branch) => {
        return await this.doRequestAndParse(`${this._baseApi}/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getAccessToken()
            },
            body: JSON.stringify({first_name, last_name, username, email, password, role, branch})
        })
    }

    updateUser = async (id, first_name, last_name, username, email, password, role, branch) => {

        let body = {first_name, last_name, username, email, role, branch}

        if (password){
            body.password = password
        }

        return await this.doRequestAndParse(`${this._baseApi}/users/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getAccessToken()
            },
            body: JSON.stringify(body)
        })
    }

    deleteUser = async id => {
        const res = await fetch(`${this._baseApi}/users/${id}/`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + getAccessToken() }
        })

        if (!res.ok){
            return { hasError: true }
        } else {
            return { hasError: false }
        }
    }

    getUsers = async () => {
        return await this.doRequestAndParse(`${this._baseApi}/users/`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + getAccessToken() }
        })
    }

    doRequestAndParse = async (url, options) => {
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
}

const getAccessToken = () => localStorage.getItem('access_token_optima')