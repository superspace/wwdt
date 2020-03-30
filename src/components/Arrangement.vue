<template>
    <div class="row c-arrangement__wrapper">
        <div class="col-md-12">
            <div class="card mb-3 c-arrangement" v-if="arrangement">

                    <draggable-asset 
                        v-for="asset in arrangement.assets" v-bind:key="asset.id" :set="asset.data = getAsset(asset.id)"
                        :asset="asset">
                    </draggable-asset>

            </div>
        </div>
        <!-- <div class="col-md-1">
            <b-button vaiant="secondary" size="sm"><b-icon-plus></b-icon-plus> Add Asset</b-button>
        </div>     -->
    </div>    
</template>

<script>

import DraggableAsset from '@/components/DraggableAsset'

import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    name: 'arrangement',
    components: {
        DraggableAsset
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