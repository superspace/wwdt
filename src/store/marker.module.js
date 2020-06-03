import Axios from "axios"
import store from "."

function doUpdateMarker (commit, marker, data) {
    return new Promise((resolve) => {
        Axios.post('/marker/update', data)
            .then(resp => {
                if (resp.data.status === 'OK') {
                    commit('updateMarker', resp.data.result)
                    resolve()
                }
            })
    })
}

const state = {
    marker: {},
    tmpMarker: {},
    markers: [],
    deleteMarkerAlert: false
}

const actions = {

    getMarkers({ commit }) {
        const sessionId = store.state.project.session.id

        const params = {
            sessionId: sessionId
        }
        Axios.get('/marker/list', {params: params})
            .then(resp => {
                commit('setMarkers', resp.data)
            })
    },

    setMarkers({ commit }, markers) {
        commit('setMarkers', markers)
    },

    setMarker ({ commit, dispatch }, marker) {
        if (marker == undefined) {
            marker = {
                id: undefined,
                title: '',
                time: 0
            }
        }
        dispatch('assets/setAsset', {}, {root: true})
        commit('setMarker', marker)
    },

    setTmpMarker ({ commit }, marker) {
        commit('setTmpMarker', marker)
    },

    setDeleteMarkerAlert ({ commit }, show) {
        commit('setDeleteMarkerAlert', show)
    },

    createMarker ({ commit }, marker) {

        let data = new FormData
        data.append('title', marker.title)
        data.append('time', Math.round(marker.time))
        data.append('sessionId', store.state.project.session.id)

        return new Promise((resolve) => {
            Axios.post('/marker/create', data)
                .then(resp => {
                    if (resp.data.status === 'OK') {
                        marker = resp.data.result
                        commit('createMarker', marker)
                        resolve()
                    }
                })
        })
    },

    updateMarker ({ commit }, marker) {

        let data = new FormData
        data.append('id', marker.id)
        data.append('title', marker.title)
        data.append('time', marker.time)

        return doUpdateMarker(commit, marker, data)

    },

    deleteMarker ({ commit}, id) {
        let data = new FormData
        data.append('id', id)

        return new Promise((resolve) => {
            Axios.post('/marker/delete', data)
                .then(() => {
                    commit('deleteMarker', id)
                    resolve()
                })
        })

    },

    removeAsset ({ commit }, {marker, id}) {

        let index = marker.assets.indexOf(parseInt(id))
        if (index != -1)
            marker.assets.splice(index, 1)

        let data = new FormData
        data.append('id', marker.id)
        data.append('assets', marker.assets)

        return doUpdateMarker(commit, marker, data)
    },
 
    addAsset ({ commit }, {marker, id}) {

        if (!marker.assets) {
            marker.assets = []
        }

        marker.assets.push(id)

        let data = new FormData
        data.append('id', marker.id)
        data.append('assets', marker.assets)

        return doUpdateMarker(commit, marker, data)
    }
}

const mutations = {

    reset (state) {
        state.marker = {}
        state.tmpMarker = {}
        state.markers = []
    },

    setMarker(state, marker) {
        state.marker = marker
    },

    setTmpMarker(state, marker) {
        state.tmpMarker = Object.assign({}, marker)
    },

    setMarkers(state, markers=[]) {
        state.markers = markers
    },

    createMarker(state, marker) {
        marker.assets = []
        state.markers.push(marker)
        state.marker = marker
    },

    updateMarker(state, marker) {
        const index = state.markers.findIndex(x => x.id === marker.id)
        state.markers.splice(index, 1, marker)
        state.marker = marker
    },

    deleteMarker(state, id) {
        const index = state.markers.findIndex(x => x.id === id)
        state.markers.splice(index, 1)
        state.marker = {}
    },

    setDeleteMarkerAlert(state, show) {
        state.deleteMarkerAlert = show
    }
}

export const marker = {
    namespaced: true,
    state,
    actions,
    mutations
}
