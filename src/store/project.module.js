import Axios from "axios"

const state = {
    project: {},
    session: {},
    recording: {},
    projects: []
}

const actions = {
    setActiveProject ({ commit }, project) {
        commit('setProject', project)
        if (project.sessions.length > 0) {
            commit('setSession', state.project.sessions[0])
            if (state.session.recordings.length > 0) {
                commit('setRecording', state.session.recordings[0])
            }
        }
    },
    getProjects: function ({ commit }) {
        Axios.get('list-projects')
            .then(data => {
                commit('setProjects', data.data.result)
            })
    }
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
