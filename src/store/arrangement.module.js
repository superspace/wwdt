import Axios from "axios"

const state = {
    arrangement: {},
    arrangements: [],
}

const actions = {

    reset ({ commit }) {
        commit('reset')
    },

    setArrangements ( {commit}, arrangements) {
        commit('setArrangements', arrangements)
    },

    setArrangement ( {commit}, arrangement) {
        commit('setArrangement', arrangement)
    },

    getArrangement ({ commit, dispatch }, id) {
        Axios.get('/arrangement/'+id)
            .then(resp=> {
                let arrangement = resp.data
                let keyframes = arrangement.keyframes
                delete arrangement.keyframes
                commit('setArrangement', arrangement)

                dispatch('keyframe/setKeyframes', keyframes, {root: true}) 
                dispatch('keyframe/setKeyframe', {}, {root: true}) 

            })
    },
}

const mutations = {

    reset (state) {
        state.arrangement = {}
        state.arrangements = []
    },

    setArrangements (state, arrangements) {
        state.arrangements = arrangements
    },

    setArrangement (state, arrangement={}) {
        state.arrangement = arrangement
    },

}

export const arrangement = {
    namespaced: true,
    state,
    actions,
    mutations
}
