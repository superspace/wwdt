const state = {
    time: 0,
    start: 0,
    end: 0,
    duration: 0,
    now: 0,
    isRecording: false
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
    },

    setIsRecording({ commit }, isRecording) {
        commit('setIsRecording', isRecording)
    }

}

const mutations = {

    reset (state) {
        state.time = 0
        state.start = 0
        state.end = 0
        state.duration = 0
    },

    setTime(state, time) {
        state.time = time
    },

    setStart(state, start) {
        state.start = start
    },

    setIsRecording(state, isRecording) {
        state.isRecording = isRecording
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
