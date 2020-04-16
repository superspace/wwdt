<template>
    <div>
        <div class="row">
            <div class="col-md-12">
                <b-button class="mb-3" size="sm" variant="primary"><b-icon-plus></b-icon-plus> Add Keyframe</b-button>
            </div>
        </div>
        <div class="row c-arrangement__wrapper">
            <div class="col-md-9">
                <div class="card mb-3 c-arrangement" v-if="arrangement">

                        <draggable-asset 
                            v-for="asset in arrangement.assets" v-bind:key="asset.id" :set="asset.data = getAsset(asset.id)"
                            :asset="asset">
                        </draggable-asset>

                </div>
            </div>
            <div class="col-md-3">
                <asset-list></asset-list>
            </div>    
        </div>    
    </div>
</template>

<script>

import DraggableAsset from '@/components/DraggableAsset'

import AssetList from '@/components/AssetList'

import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    name: 'arrangement',
    components: {
        DraggableAsset,
        AssetList
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
        ...mapState('arrangement', ['arrangement', 'arrangements'])
    },
    methods: {
        ...mapActions('arrangement', ['getArrangement']),

    }
}
</script>

<style lang="scss">

.c-arrangement {
    height: 100%;

    &__wrapper {
        height: 100%;
    }
}

</style>