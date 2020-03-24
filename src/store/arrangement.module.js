const state = {
    arrangement: {},
    arrangements: [
        {
            id: 1,
            title: 'Arrangement A',
            assets: [
                {
                    id: 2,
                    title: 'Bild',
                    src: '/assets/uploads/session-1/asset-4.jpg',
                    type: 'JPG',
                    props: [
                        {
                            timestamp: 4,
                            x: 120,
                            y: 60,
                            z: 3,
                            scale: 1,
                        },
                        {
                            timestamp: 9,
                            x: 200,
                            y: 80,
                            z: 7,
                            scale: 1.5,
                        },
                        {
                            timestamp: 16,
                            x: 300,
                            y: 70,
                            z: 3,
                            scale: 1,
                        },
                        {
                            timestamp: 20,
                            action: 'out'
                        }
                    ]
                },
                {
                    id: 4,
                    title: 'Zeitplan',
                    src: '',
                    type: 'XLS',
                    props: [
                        {
                            timestamp: 0,
                            x: 300,
                            y: 90,
                            z: 2,
                            scale: 1,
                        },
                        {
                            timestamp: 6,
                            x: 500,
                            y: 90,
                            z: 20,
                            scale: 1.5,
                        },
                        {
                            timestamp: 14,
                            x: 400,
                            y: 20,
                            z: 2,
                            scale: 1,
                        },
                    ]
                },
                {
                    id: 5,
                    title: 'Bild 2',
                    src: '/assets/uploads/session-1/asset-1.jpg',
                    type: 'JPG',
                    props: [
                        {
                            timestamp: 2,
                            x: 100,
                            y: 120,
                            z: 3,
                            scale: 1,
                        },
                        {
                            timestamp: 7,
                            x: 100,
                            y: 120,
                            z: 7,
                            scale: 2,
                        },
                        {
                            timestamp: 14,
                            x: 100,
                            y: 20,
                            z: 3,
                            scale: 1,
                        }
                    ]
                },
            ]
        },

    ]
}

const actions = {
    setActiveArrangement ({ commit }, arrangement) {
        commit('setActiveArrangement', arrangement)
    },
}

const mutations = {
    setActiveArrangement(state, arrangement) {
        state.arrangement = arrangement
    },
}

export const arrangement = {
    namespaced: true,
    state,
    actions,
    mutations
}
