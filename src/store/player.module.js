const state = {
    position: 0,
    play: false,
    rate: 1
}

const actions = {
    setPosition({ commit }, time) {
        commit('setPosition', time)
    },
    setPlaybackRate({ commit }, rate) {
        commit('setPlaybackRate', rate)
    },
    startPlayer({ commit }) {
        commit('startPlayer')
    },
    stopPlayer({ commit }) {
        commit('stopPlayer')
    }
}

const mutations = {

    reset (state) {
        state.position = 0
        state.rate = 1
    },

    setPosition(state, time) {
        state.position = time
    },
    setPlaybackRate(state, rate) {
        state.rate = rate;
    },
    startPlayer(state) {
        state.play = true
    },
    stopPlayer(state) {
        state.play = false
    }
}

export const player = {
    namespaced: true,
    state,
    actions,
    mutations
}
