import Axios from "axios"

const state = {
    arrangement: {},
    arrangements: [],
}

const actions = {

    setArrangements ( {commit}, arrangements) {
        commit('setArrangements', arrangements)
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

    setArrangements (state, arrangements) {
        state.arrangements = arrangements
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
