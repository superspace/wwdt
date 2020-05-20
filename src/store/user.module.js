import Axios from "axios"

const state = {
    id: 0,
    firstname: '',
    lastname: '',
    email: '',
    role: ''
}

const actions = {
    login ({ commit }, {email, token}) {

        let data = new FormData
        data.append('email', email)
        data.append('token', token)

        return new Promise((resolve, reject) => {
            Axios.post('/user/login', data)
                .then(resp => {
                    if (resp.data.status === 'OK') {
                        const user = resp.data.result.user
                        commit('login', user)
                        resolve()
                    }
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    logout ({ commit }) {
        commit('logout')
    },
}

const getters = {
    isLoggedIn: () => () => {
        return localStorage.getItem('authKey') ? true : false
    },
    authKey: () => () => {
        return localStorage.getItem('authKey')
    }
}

const mutations = {
    login (state, user) {

        localStorage.setItem('authKey', user.authKey)

        state.id = user.id
        state.firstname = user.firstname
        state.lastname = user.lastname
        state.email = user.email
        state.role = user.role
    },

    logout (state) {

        localStorage.removeItem('authKey')

        state.id = 0
        state.firstname = ''
        state.lastname = ''
        state.email = ''
        state.role = ''
    }
}

export const user = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
