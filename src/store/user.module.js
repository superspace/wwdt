import Axios from "axios"

const state = {
    id: 0,
    firstname: '',
    lastname: '',
    email: '',
    role: ''
}

const actions = {

    reset ({commit}) {
        commit('reset')
    },

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

    getUser({commit}) {
        return new Promise((resolve, reject) => {
            Axios.get('/user')
                .then(resp => {
                    if (resp.data.status === 'OK') {
                        const result = resp.data.result.user
                        let user = {}
                        user.id = result.id
                        user.firstname = result.firstname
                        user.lastname = result.lastname
                        user.email = result.email
                        user.role = result.role
                        commit('setUser', user)
                        resolve()
                    }
                })
                .catch(error => {
                    reject(error)
                })
        })

    },

    getUserRole ({ commit }, projectId) {
        return new Promise((resolve) => {

            Axios.get('/user/role/'+ projectId)
                .then(resp => {
                    if (resp.data.userId == state.id) {
                        const role = resp.data.role
                        commit('setUserRole', role)
                    }
                    resolve()
                })
        })
    }
}

const getters = {
    isLoggedIn: () => () => {
        return localStorage.getItem('authKey') ? true : false
    },
    authKey: () => () => {
        return localStorage.getItem('authKey')
    },
    hasEditPermission: function (state, getters, rootState, rootGetters) {

        if (rootGetters['project/sessionMode'] == rootState.project.MODE_RECORD) {
            if (state.role === 'Admin') {
                return true
            } else {
                return false
            }
        }
        return true
    }
}

const mutations = {

    reset (state) {
        state.role = ''
    },

    setUser (state, user) {
        state.id = user.id
        state.firstname = user.firstname
        state.lastname = user.lastname
        state.email = user.email
    },

    setUserRole (state, role) {
        state.role = role
    },

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
