import Axios from "axios"

// import store from "../store"

const state = {
    project: {},
    session: {},
    recording: {},
    projects: []
}

const actions = {

    getProjects: function ({ commit }) {
        Axios.get('project/list')
            .then(data => {
                commit('setProjects', data.data.result)
            })
    },

    setProject ({ commit, dispatch }, project) {
        commit('setProject', project)
        if (project.sessions.length > 0) {

            // Set Session
            dispatch('setSession', state.project.sessions[0])

        }
    },

    setSession ({ commit, dispatch }, session) {
        commit('setSession', session)

        // Set recording
        if (session.recordings.length > 0) {
            commit('setRecording', session.recordings[0])
        }

        // Set Arrangement
        if (session.arrangements.length > 0) {
            dispatch('arrangement/setArrangements', session.arrangements, {root: true})
        }

        // Load assets
        dispatch('assets/getAssets', session.id, {root: true})
            .then(() => {
                // Load markers
                dispatch('marker/getMarkers', session.id, {root: true})
            })
    },

}

const mutations = {
    setProjects(state, projects) {
        state.projects = projects
    },
    setProject(state, project) {
        state.project = project
    },
    setSession(state, session) {
        state.session = session
    },
    setRecording(state, recording) {
        state.recording = recording
    }
}

export const project = {
    namespaced: true,
    state,
    actions,
    mutations
}
