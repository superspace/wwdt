import Axios from "axios"
import Vue from "vue"
import store from "."

const sortKeyframes = function (state) {
    state.keyframes.sort((a,b) => a.time > b.time ? 1 : -1 )
}

const state = {
    keyframe: {},
    tmpKeyframe: {},
    keyframes: [],
    deleteKeyframeAlert: false
}

const actions = {

    setKeyframes({ commit }, keyframes) {
        commit('setKeyframes', keyframes)
    },

    setKeyframe({ commit }, keyframe) {
        commit('setKeyframe', keyframe)
    },

    setTmpKeyframe({ commit }, keyframe) {
        commit('setTmpKeyframe', keyframe)
    },

    setDeleteKeyframeAlert ({ commit }, show) {
        commit('setDeleteKeyframeAlert', show)
    },

    createKeyframe ({ commit }, keyframe) {
        let data = new FormData
        data.append('title', keyframe.title)
        data.append('time', keyframe.time)
        data.append('arrangementId', store.state.arrangement.arrangement.id)

        return new Promise((resolve) => {
            Axios.post('/keyframe/create', data)
                .then(resp => {
                    if (resp.data.status === 'OK') {
                        let keyframe = resp.data.result
                        keyframe.assets = []
                        for (let item of state.keyframe.assets) {
                            let asset = {
                                id: item.id,
                                props: Object.assign({}, item.props)
                            }
                            keyframe.assets.push(asset)
                        }
                        commit('createKeyframe', keyframe)
                        resolve()
                    }
                })
        })
    },

    updateKeyframe({ commit }, keyframe) {

        let data = new FormData
        data.append('id', keyframe.id)
        data.append('title', keyframe.title)
        data.append('time', keyframe.time)

        return new Promise((resolve) => {
            Axios.post('/keyframe/update', data)
                .then(resp => {
                    if (resp.data.status === 'OK') {
                        commit('updateKeyframe', keyframe)
                        resolve()
                    }
                })
        })
    },

    deleteKeyframe({ commit }, keyframe) {

        const params = {
            id: keyframe.id
        }

        return new Promise((resolve) => {
            Axios.get('/keyframe/delete', {params: params})
                .then(resp => {
                    if (resp.data.status === 'OK') {
                        commit('deleteKeyframe', keyframe)
                        resolve()
                    }
                })
        })
    },

    updateProperties({ commit }, {asset, props}) {

        let data = new FormData
        data.append('keyframeId', state.keyframe.id)
        data.append('assetId', asset.id)
        if (props.x) data.append('x', props.x)
        if (props.y) data.append('y', props.y)
        if (props.z) data.append('z', props.z)
        if (props.scale) data.append('scale', props.scale)

        Axios.post('/keyframe/properties/update', data)
            .then(resp => {
                if (resp.data.status === 'OK') {
                    const payload = {
                        asset: asset,
                        props: props
                    }
                    commit('updateProperties', payload)
                }
            })
    },

    addPropertiesToKeyframe({ commit }, {asset, props}) {
        let data = new FormData
        data.append('keyframeId', state.keyframe.id)
        data.append('assetId', asset.id)
        data.append('x', props.x)
        data.append('y', props.y)
        data.append('z', props.z)
        data.append('scale', props.scale)

        Axios.post('/keyframe/properties/add', data)
            .then(resp => {
                if (resp.data.status === 'OK') {
                    const payload = {
                        asset: asset,
                        props: props
                    }
                    commit('addPropertiesToKeyframe', payload)
                }
            })

    },

    removeAssetFromKeyframe ({ commit }, asset) {

        let data = new FormData
        data.append('keyframeId', state.keyframe.id)
        data.append('assetId', asset.id)

        Axios.post('/keyframe/properties/remove', data)
            .then(resp => {
                if (resp.data.status === 'OK') {
                    commit('removeAssetFromKeyframe', asset)
                }
            })
    }
}

const mutations = {

    setKeyframes (state, keyframes) {
        state.keyframes = keyframes
        sortKeyframes(state)
    },

    setKeyframe (state, keyframe) {
        if (!keyframe) {
            keyframe = {
                id: 0,
                title: '',
                time: 0,
                assets: []
            }
        }
        state.keyframe = keyframe
        sortKeyframes(state)
    },

    setTmpKeyframe (state, keyframe) {
        state.tmpKeyframe = Object.assign({}, keyframe)
    },

    updateKeyframe (state, keyframe) {
        const i = state.keyframes.findIndex(x => x.id === keyframe.id)
        state.keyframes.splice(i, 1, keyframe)
        sortKeyframes(state)
    },

    createKeyframe (state, keyframe) {
        keyframe.assets = keyframe.assets ? keyframe.assets : []
        state.keyframes.push(keyframe)
        sortKeyframes(state)
        state.keyframe = keyframe
    },

    deleteKeyframe (state, keyframe) {
        const i = state.keyframes.findIndex(x => x.id === keyframe.id)
        state.keyframes.splice(i, 1)
        state.keyframe = state.tmpKeyframe = {}
    },

    addPropertiesToKeyframe (state, {asset, props}) {
        let data = {
            id: parseInt(asset.id),
            props: props
        }
        state.keyframe.assets.push(data)
    },

    removeAssetFromKeyframe (state, asset) {
        const i = state.keyframe.assets.findIndex(x => x.id === asset.id)
        state.keyframe.assets.splice(i, 1)
    },

    updateProperties (state, {asset, props}) {
        const i = state.keyframe.assets.findIndex(x => x.id === asset.id)
        const currentAsset = state.keyframe.assets[i];
        const newProps = Object.assign(currentAsset.props, props)
        Vue.set(currentAsset, 'props', newProps)
    },

    setDeleteKeyframeAlert(state, show) {
        state.deleteKeyframeAlert = show
    }

}

export const keyframe = {
    namespaced: true,
    state,
    actions,
    mutations
}