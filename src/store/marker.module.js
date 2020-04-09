import Axios from "axios"
// import Vue from "vue"

function doUpdateMarker (commit, marker, data) {
    return new Promise((resolve) => {
        Axios.post('/marker/update', data)
            .then(data => {
                if (data.data.status === 'OK') {
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
            .then(data => {
                commit('setMarkers', data.data.result)
            })
    },

    setMarker ({ commit }, marker) {
        commit('setMarker', marker)
    },

    setTmpMarker ({ commit }, marker) {
        commit('setTmpMarker', marker)
    },

    addMarker ({ commit }, marker) {
        Axios.post('/marker/add', marker)
            .then(data => {
                if (data.data.status === 'OK') {
                    commit('addMarker', marker)
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
 
    addAsset ({ commit }, marker, id) {

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

    // addMarker(state, marker) {
    //     marker.assets = []
    //     state.markers.push(marker)
    //     state.marker = marker
    // },

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
