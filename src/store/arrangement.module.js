import Axios from "axios"

const state = {
    arrangement: {},
    arrangements: [],
    active: true
}

const actions = {

    reset ({ commit }) {
        commit('reset')
    },

    setActive ({ commit }, active) {
        commit('setActive', active)
    },

    setArrangements ( {commit}, arrangements) {
        commit('setArrangements', arrangements)
    },

    setArrangement ( {commit}, arrangement) {
        commit('setArrangement', arrangement)
    },

    getArrangement ({ commit, dispatch }, id) {

        return new Promise((resolve) => {
            Axios.get('/arrangement/'+id)
                .then(resp=> {
                    let arrangement = resp.data
                    let keyframes = arrangement.keyframes
                    delete arrangement.keyframes
                    commit('setArrangement', arrangement)

                    dispatch('keyframe/setKeyframes', keyframes, {root: true}) 
                    dispatch('keyframe/setKeyframe', {}, {root: true}) 
                    
                    resolve()

                })
            })
        },
}

const mutations = {

    reset (state) {
        state.arrangement = {}
        state.arrangements = []
    },

    setActive (state, active) {
        state.active = active
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
