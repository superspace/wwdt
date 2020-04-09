import Axios from "axios"

const state = {
    arrangement: {},
    arrangements: [],
    keyframes: []
}

const actions = {

    setArrangements ( {commit}, arrangements) {
        commit('setArrangements', arrangements)
    },

    getArrangement ({ commit }, id) {
        Axios.get('/arrangement/'+id)
            .then(data=> {
                if (data.data.status == 'OK') {
                    let arrangement = data.data.result
                    let keyframes = arrangement.keyframes
                    delete arrangement.keyframes
                    commit('setArrangement', arrangement)
                    commit('setKeyframes', keyframes)
                }
            })

    }
}

const mutations = {
    setArrangements (state, arrangements) {
        state.arrangements = arrangements
    },
    setKeyframes (state, keyframes) {
        state.keyframes = keyframes
    },
    setArrangement (state, arrangement) {
        state.arrangement = arrangement
    },
}

export const arrangement = {
    namespaced: true,
    state,
    actions,
    mutations
}
