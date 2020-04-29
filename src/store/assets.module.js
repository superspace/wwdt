import Axios from "axios"
import Vue from "vue"
import store from "."

const state = {
    asset: {},
    tmpAsset: {},
    assets: {},
    types: [
        {value: 'FILE', text: 'File', types: ['doc','docx','pdf','xls','xlsx']},
        {value: 'IMAGE', text: 'Image', types: ['jpeg','jpg','gif','png','svg']},
        {value: 'TEXT', text: 'Text'},
        {value: 'VIDEO', text: 'Video', types: ['mp4']},
        {value: 'AUDIO', text: 'Audio', types: ['mp3']},
        {value: 'LABEL', text: 'Label'},
        {value: 'URL', text: 'Link'}
    ],
    ranking: [1,2,3,4,5]
}

const getters = {

    getAsset: (state) => (id) => {
        let asset = (state.assets.hasOwnProperty(id)) ? state.assets[id] : {}
        asset.id = id
        return asset
    },

    allowedFileTypes: () => {
        const index = state.types.findIndex(x => x.value === state.tmpAsset.type)
        return state.types[index].types
    },
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
        data.append('type', asset.type)
        data.append('file', asset.upload)

        return new Promise((resolve) => {
            Axios.post('/asset/update', 
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
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
                .then(resp => {
                    if (resp.data.status === 'OK') {
                        commit('deleteAsset', id)
                        resolve()
                    }
                })
        })


    },

    createAsset({ commit, dispatch}, {asset, marker}) {
        
        let data = new FormData
        data.append('title', asset.title)
        data.append('description', asset.description)
        data.append('content', asset.content)
        data.append('tags', asset.tags)
        data.append('rank', asset.rank)
        data.append('type', asset.type)
        data.append('file', asset.upload)
        data.append('sessionId', store.state.project.session.id)

        return new Promise((resolve) => {
            Axios.post('/asset/create', data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(resp => {
                    if (resp.data.status === 'OK') {
                        commit('createAsset', resp.data.result)

                        if (marker && marker.id !== 0) {
                            const payload = {
                                marker: marker,
                                id: resp.data.result.id,
                            }
                            dispatch('marker/addAsset', payload, {root: true}) 
                        }
                        resolve()
                    }
                })
        })

    },
  
    getAssets({ commit }) {

        const sessionId = store.state.project.session.id

        const params = {
            sessionId: sessionId
        }
        return new Promise((resolve) => {

            Axios.get('/asset/list', {params: params})
                .then(resp => {
                    commit('setAssets', resp.data)
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
        Vue.set(state.assets, asset.id, asset)
        state.asset = asset
    },

    deleteAsset(state, id) {
        if (state.assets.hasOwnProperty(id)) {
            delete state.assets[id]
        }
    },

    setTmpAsset(state, asset) {
        if (!asset) {
            asset = {
                id: undefined,
                title: '',
                description: '',
                content: '',
                tags: [],
                rank: 0,
                type: 'IMAGE',
                file: undefined
            }
        }
        state.tmpAsset = Object.assign({}, asset)
    },

    createAsset(state, asset) {
        Vue.set(state.assets, asset.id, asset)
        state.asset = asset
    }
}

export const assets = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
