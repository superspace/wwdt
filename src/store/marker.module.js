import Axios from "axios"
// import store from "../store"

const state = {
    marker: {},
    markers: []
}

const actions = {
    setMarker ({ commit }, marker) {
        commit('setMarker', marker)
    },
    addMarker ({ commit }, marker) {
        Axios.post('/add-marker', marker)
            .then(data => {
                if (data.data.status === 'OK') {
                    commit('addMarker', marker)
                }
            })
    },
    // addAsset ({ commit }, asset) {
    //     Axios.post('/add-asset', asset, 
    //             {
    //                 headers: {'Content-Type': 'multipart/form-data'}
    //             }
    //         )
    //         .then(data => {
    //             if (data.data.status === 'OK') {
    //                 commit('addAsset', asset)
    //             }
    //         })
    // },
    getMarkers({ commit }, sessionId) {
        const params = {
            sessionId: sessionId
        }
        Axios.get('/get-markers', {params: params})
            .then(data => {
                commit('setMarkers', data.data.result)
            })
    }
}

const mutations = {
    setMarker(state, marker) {
        state.marker = marker
    },
    setMarkers(state, markers) {

        // Plug assets to markers
        // markers.forEach((marker) => {
        //     marker.assets = []
        //     marker.assetids.forEach((id) => {
        //         let asset = store.getters['assets/getAsset'](id)
        //         asset.id = id
        //         marker.assets.push(asset)
        //     })

        // });

        state.markers = markers
    },
    addMarker(state, marker) {
        marker.id = state.markers.length + 1
        marker.assets = []
        state.markers.push(marker)
        state.marker = marker
    },
    // addAsset(state, asset) {
    //     const index = state.markers.indexOf(state.marker)
    //     state.marker.assets.push(asset)
    //     state.markers.splice(index, 1, state.marker)        
    // }
}

export const marker = {
    namespaced: true,
    state,
    actions,
    mutations
}
