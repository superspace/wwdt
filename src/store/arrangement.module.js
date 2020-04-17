import Axios from "axios"
import Vue from "vue"

const sortKeyframes = function (state) {
    state.keyframes.sort((a,b) => a.time > b.time ? 1 : -1 )
}

const state = {
    arrangement: {},
    arrangements: [],
    keyframes: [],
    keyframe: {},
    tmpKeyframe: {}
}

const actions = {

    setArrangements ( {commit}, arrangements) {
        commit('setArrangements', arrangements)
    },

    getArrangement ({ commit }, id) {
        Axios.get('/arrangement/'+id)
            .then(resp=> {
                if (resp.data.status == 'OK') {
                    let arrangement = resp.data.result
                    let keyframes = arrangement.keyframes
                    delete arrangement.keyframes
                    commit('setArrangement', arrangement)
                    commit('setKeyframes', keyframes)
                    commit('setKeyframe')
                }
            })

    },

    setKeyframe({ commit }, keyframe) {
        commit('setKeyframe', keyframe)
    },

    setTmpKeyframe({ commit }, keyframe) {
        commit('setTmpKeyframe', keyframe)
    },

    createKeyframe ({ commit }, keyframe) {
        let data = new FormData
        data.append('title', keyframe.title)
        data.append('time', keyframe.time)

        return new Promise((resolve) => {
            Axios.post('/keyframe/create', data)
                .then(resp => {
                    if (resp.data.status === 'OK') {
                        commit('createKeyframe', resp.data.result)
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

        Axios.post('/keyframe/update', data)
            .then(resp => {
                if (resp.data.status === 'OK') {
                    commit('updateKeyframe', keyframe)
                }
            })
    },

    deleteKeyFrame({ commit }, keyframe) {

        let data = new FormData
        data.append('id', keyframe.id)

        Axios.post('/keyframe/delete', data)
            .then(resp => {
                if (resp.data.status === 'OK') {
                    commit('deleteKeyframe', keyframe)
                }
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

        Axios.post('/keyframe/asset/update', data)
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

    removeAssetFromKeyframe ({ commit }, asset) {

        let data = new FormData
        data.append('keyframeId', state.keyframe.id)
        data.append('assetId', asset.id)

        Axios.post('/keyframe/asset/remove', data)
            .then(resp => {
                if (resp.data.status === 'OK') {
                    commit('removeAssetFromKeyframe', asset)
                }
            })
    }
}

const mutations = {

    setArrangements (state, arrangements) {
        state.arrangements = arrangements
    },

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

    setArrangement (state, arrangement) {
        state.arrangement = arrangement
    },

    updateKeyframe (state, keyframe) {
        const i = state.keyframes.findIndex(x => x.id === keyframe.id)
        state.keyframes.splice(i, 1, keyframe)
        sortKeyframes(state)
    },

    createKeyframe (state, keyframe) {
        state.keyframes.push(keyframe)
        sortKeyframes(state)
    },

    deleteKeyFrame (state, keyframe) {
        const i = state.keyframes.findIndex(x => x.id === keyframe.id)
        state.keyframes.splice(i, 1)
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
    }

}

export const arrangement = {
    namespaced: true,
    state,
    actions,
    mutations
}
