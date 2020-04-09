import Axios from "axios"

const state = {
    asset: {},
    tmpAsset: {},
    assets: {},
    types: [
        {value: 'FILE', text: 'Datei (DOC,XLS,PDF)'},
        {value: 'IMAGE', text: 'Bild (JPG,PNG,GIF)'},
        {value: 'TEXT', text: 'Text'},
        {value: 'VIDEO', text: 'Video (MP4)'},
        {value: 'AUDIO', text: 'Audio (MP3)'},
        {value: 'LABEL', text: 'Textlabel'}
    ],
    ranking: [1,2,3,4,5],
}

const getters = {

    getAsset: (state) => (id) => {
        let asset = (state.assets.hasOwnProperty(id)) ? state.assets[id] : {}
        asset.id = id
        return asset
    }
}

const actions = {
    setAsset ({ commit }, asset) {
        commit('setAsset', asset)

    },

    updateAsset ({ commit }, asset) {

        let data = new FormData
        data.append('id', asset.id)
        data.append('title', asset.title)
        data.append('description', asset.description)
        data.append('content', asset.content)
        data.append('tags', asset.tags)
        data.append('rank', asset.rank)

        return new Promise((resolve) => {
            Axios.post('/asset/update', data)
                .then(data => {
                    if (data.data.status === 'OK') {
                        commit('updateAsset', asset)
                        resolve()
                    }
                })
        })
    },

    deleteAsset ( {commit}, id) {
        let data = new FormData
        data.append('id', id)

        return new Promise((resolve) => {
            Axios.post('/asset/delete', data)
                .then(data => {
                    if (data.data.status === 'OK') {
                        commit('deleteAsset', id)
                        resolve()
                    }
                })
        })


    },
  
    // addAsset ({ commit }, asset) {
    //     Axios.post(
    //         '/add-asset', 
    //         asset,
    //         {
    //             headers: {'Content-Type': 'multipart/form-data'}
    //         }
    //     )
    //     .then(data => {
    //         if (data.data.status === 'OK') {
    //             commit('addAsset', asset)
    //         }
    //     })
    // },

    getAssets({ commit }, sessionId) {
        const params = {
            sessionId: sessionId
        }
        return new Promise((resolve) => {

            Axios.get('/asset/list', {params: params})
                .then(data => {
                    commit('setAssets', data.data.result)
                    resolve()
                })
        })
    },

    setTmpAsset ({ commit }, asset) {
        commit('setTmpAsset', asset)
    }
}

const mutations = {
    setAsset(state, asset) {
        state.asset = asset
    },
    setAssets(state, assets) {
        state.assets = assets
    },
    updateAsset(state, asset) {
        state.assets[asset.id] = asset
    },
    deleteAsset(state, id) {
        if (state.assets.hasOwnProperty(id)) {
            delete state.assets[id]
        }
    },
    setTmpAsset(state, asset) {
        state.tmpAsset = Object.assign({}, asset)
    }
}

export const assets = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
