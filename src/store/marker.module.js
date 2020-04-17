import Axios from "axios"
// import Vue from "vue"

function doUpdateMarker (commit, marker, data) {
    return new Promise((resolve) => {
        Axios.post('/marker/update', data)
            .then(resp => {
                if (resp.data.status === 'OK') {
                    commit('updateMarker', marker)
                    resolve()
                }
            })
    })
}

const state = {
    marker: {},
    tmpMarker: {},
    markers: []
}

const actions = {

    getMarkers({ commit }, sessionId) {
        const params = {
            sessionId: sessionId
        }
        Axios.get('/marker/list', {params: params})
            .then(resp => {
                commit('setMarkers', resp.data.result)
            })
    },

    setMarker ({ commit }, marker) {
        if (marker == undefined) {
            marker = {
                id: undefined,
                title: '',
                time: 0
            }
        }
        commit('setMarker', marker)
    },

    setTmpMarker ({ commit }, marker) {
        commit('setTmpMarker', marker)
    },

    createMarker ({ commit }, marker) {

        let data = new FormData
        data.append('title', marker.title)
        data.append('time', marker.time)

        Axios.post('/marker/create', data)
            .then(resp => {
                if (resp.data.status === 'OK') {
                    commit('createMarker', resp.data.result)
                }
            })
    },

    updateMarker ({ commit }, marker) {

        let data = new FormData
        data.append('id', marker.id)
        data.append('title', marker.title)
        data.append('time', marker.time)

        return doUpdateMarker(commit, marker, data)

    },

    removeMarker ({ commit}, marker) {
        const params = {
            id: marker.id
        }
        Axios.get('/marker/delete', {params: params})
            .then(() => {
                commit('deleteMarker', marker.id)
            })

    },

    removeAsset ({ commit }, {marker, id}) {

        let index = marker.assets.indexOf(id)
        if (index != -1)
            marker.assets.splice(index, 1)

        let data = new FormData
        data.append('id', marker.id)
        data.append('assets', marker.assets)

        return doUpdateMarker(commit, marker, data)
    },
 
    addAsset ({ commit }, {marker, id}) {

        marker.assets.push(id)

        let data = new FormData
        data.append('id', marker.id)
        data.append('assets', marker.assets)

        return doUpdateMarker(commit, marker, data)
    }
}

const mutations = {
    setMarker(state, marker) {
        state.marker = marker
    },

    setTmpMarker(state, marker) {
        state.tmpMarker = Object.assign({}, marker)
    },

    setMarkers(state, markers) {
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
    }
}

export const marker = {
    namespaced: true,
    state,
    actions,
    mutations
}
