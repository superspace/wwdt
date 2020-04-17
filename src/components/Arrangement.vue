<template>
    <div>
        <div class="row">
            <div class="col-md-12 d-flex justify-content-between align-items-center">
                <span>{{ keyframe.title }}</span>
                <b-button class="mb-3" size="sm" variant="primary" @click.prevent="openCreateKeyframeModal">
                    <b-icon-plus></b-icon-plus> Add Keyframe
                </b-button>
            </div>
        </div>
        <div class="row c-arrangement__wrapper">
            <div class="col">
                <div class="card mb-3 c-arrangement" v-if="arrangement">

                    <draggable-asset 
                        v-for="asset in keyframe.assets" v-bind:key="asset.id" :set="asset.data = getAsset(asset.id)"
                        :asset="asset.data" :props="asset.props">
                    </draggable-asset>

                </div>
            </div>

        </div>    
    </div>
</template>

<script>

import DraggableAsset from '@/components/DraggableAsset'

import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    name: 'arrangement',
    components: {
        DraggableAsset,
    },
    mounted: function () {

        this.getArrangement(this.arrangements[0]['id'])

    },
    data() {
        return {
        }
    },
    computed: {
        ...mapGetters('assets', ['getAsset']),
        ...mapState('arrangement', ['arrangement', 'arrangements','keyframes','keyframe'])
    },
    methods: {
        ...mapActions('arrangement', ['getArrangement']),

    }
}
</script>

<style lang="scss">

.c-arrangement {
    height: calc(100vh - 340px);
}

</style>