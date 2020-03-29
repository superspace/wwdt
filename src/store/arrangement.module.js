import Axios from "axios"

const state = {
    arrangement: {},
    arrangements: []
}

const actions = {

    setArrangements ( {commit}, arrangements) {
        commit('setArrangements', arrangements)
    },

    getArrangement ({ commit }, id) {
        const params = {
            id: id
        }
        Axios.get('/get-arrangement', {params: params})
            .then(data=> {
                commit('setArrangement', data.data.result)
            })

    }
}

const mutations = {
    setArrangements(state, arrangements) {
        state.arrangements = arrangements
    },
    setArrangement(state, arrangement) {
        state.arrangement = arrangement
    },
}

export const arrangement = {
    namespaced: true,
    state,
    actions,
    mutations
}
