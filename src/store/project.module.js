import Axios from "axios"

const state = {
    projects: [],
    project: {},
    session: {},
    recording: {}
}

const actions = {

    getProjects: function ({ commit }) {
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
        dispatch('assets/getAssets', {}, {root: true})
            .then(() => {
                // Load markers
                dispatch('marker/getMarkers', {}, {root: true})
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
