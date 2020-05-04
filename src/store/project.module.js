import Axios from "axios"

const state = {
    projects: [],
    project: {},
    session: {},
    recording: {}
}

const getters = {

    sessionMode: function () {
        return state.recording.id ? 'MODE_EDIT' : 'MODE_RECORD'
    }    
}

const actions = {

    resetProject ({commit}) {
        commit('reset')
        commit('arrangement/reset', {}, {root: true})
        commit('assets/reset', {}, {root: true})
        commit('keyframe/reset', {}, {root: true})
        commit('marker/reset', {}, {root: true})
        commit('player/reset', {}, {root: true})
        commit('timeline/reset', {}, {root: true})
    },

    getProjects ({ commit }) {
        return new Promise((resolve) => {
            Axios.get('project/list')
                .then(resp => {
                    resp.data = resp.data ? resp.data : []
                    commit('setProjects', resp.data)
                    resolve()
                })
        })
    },

    setProject ({ commit, dispatch }, project) {

        // Reset on project switch
        dispatch('resetProject')

        // Set new project
        commit('setProject', project)

        if (project.sessions.length > 0) {

            // Set Session
            dispatch('setSession', state.project.sessions[0])
        }
    },

    setSession ({ commit, dispatch }, session) {

        if (session.recordings.length) {
            session.start = Date.now() //TODO: Get starttime from API
        }

        commit('setSession', session)

        // Set recording
        if (session.recordings.length) {
            commit('setRecording', session.recordings[0])
        }

        // Set Arrangement
        if (session.arrangements.length) {
            dispatch('arrangement/setArrangements', session.arrangements, {root: true})
        }

        // Load assets
        dispatch('assets/getAssets', {}, {root: true})
            .then(() => {
                // Load markers
                dispatch('marker/getMarkers', {}, {root: true})
            })
    },

    setSessionStart ({ commit }, start) {

        commit('setSessionStart', start)
        commit('timeline/setStart', start, {root: true})
        commit('timeline/setIsRecording', true, {root: true})

        // let data = new FormData
        // data.append('id', state.session.id)
        // data.append('start', start)

        // return new Promise((resolve) => {
        //     Axios.post('/project/session/update', data)
        //         .then(resp => {
        //             if (resp.data.status === 'OK') {
        //                 resolve()
        //             }
        //         })
        // })
    },

    setSessionEnd ({ commit }, end) {
        commit('setSessionEnd', end)
        commit('timeline/setIsRecording', false, {root: true})
    }

}

const mutations = {

    reset (state) {
        state.project = {}
        state.session =  {}
        state.recording =  {}
    },

    setProjects(state, projects=[]) {
        state.projects = projects
    },

    setProject(state, project={}) {
        state.project = project
    },

    setSession(state, session={}) {
        state.session = session
    },

    setSessionStart(state, start) {
        state.session.start = start
    },

    setSessionEnd(state, end) {
        state.session.end = end
    },

    setRecording(state, recording={}) {
        state.recording = recording
    }
}

export const project = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
