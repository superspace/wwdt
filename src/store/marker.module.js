import Axios from "axios"
import store from "."

const state = {
    marker: {},
    markers: []
}

const actions = {
    setActiveMarker ({ commit }, marker) {
        commit('setActiveMarker', marker)
    },
    addMarker ({ commit }, marker) {
        Axios.post('/add-marker', marker)
            .then(data => {
                if (data.data.status === 'OK') {
                    commit('addMarker', marker)
                }
            })
    },
    addAsset ({ commit }, asset) {
        Axios.post('/add-asset', asset, 
                {
                    headers: {'Content-Type': 'multipart/form-data'}
                }
            )
            .then(data => {
                if (data.data.status === 'OK') {
                    commit('addAsset', asset)
                }
            })
    },
    getMarkers({ commit }) {
        const params = {
            projectId: store.state.project.project.id
        }
        Axios.get('list-markers', {params: params})
            .then(data => {
                commit('setMarkers', data.data.result)
            })
    }
}

const mutations = {
    setActiveMarker(state, marker) {
        state.marker = marker
    },
    setMarkers(state, markers) {
        state.markers = markers
    },
    addMarker(state, marker) {
        marker.id = state.markers.length + 1
        marker.assets = []
        state.markers.push(marker)
        state.marker = marker
    },
    addAsset(state, asset) {
        const index = state.markers.indexOf(state.marker)
        state.marker.assets.push(asset)
        state.markers.splice(index, 1, state.marker)        
    }
}

export const marker = {
    namespaced: true,
    state,
    actions,
    mutations
}
