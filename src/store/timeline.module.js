const state = {
    time: 0,
    start: 0,
    end: 0,
    duration: 0
}

const actions = {
    setTime({ commit }, time) {
        commit('setTime', time)
    },
    setStart({ commit }, start) {
        commit('setStart', start)
    },
    setDuration({ commit }, duration) {
        commit('setDuration', duration)
    }
}

const mutations = {
    setTime(state, time) {
        state.time = time
    },
    setStart(state, start) {
        state.start = start
    },
    setDuration(state, duration) {
        state.duration = duration
        state.end = state.start + duration * 1000
    }
}

export const timeline = {
    namespaced: true,
    state,
    actions,
    mutations
}
