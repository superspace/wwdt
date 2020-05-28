const state = {
    time: 0,
    start: 0,
    end: 0,
    duration: 0,
    now: 0,
    isRecording: false,
    timeInterval: null,
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
    },

    startTimer({ commit }) {
        commit('startTimer')
    },

    stopTimer() {
        clearInterval(state.timeInterval)
    },

}

const mutations = {

    reset (state) {
        state.time = 0
        state.start = 0
        state.end = 0
        state.duration = 0
        if (state.timeInterval) {
            clearInterval(state.timeInterval)
        }
        state.isRecording = false
        state.timeInterval = null
        state.now = 0
    },

    startTimer(state) {
        state.isRecording = true;
        state.timeInterval = setInterval(function() {
            state.now = Date.now()
        }, 500);
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
