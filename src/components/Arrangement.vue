<template>
    <div class="row c-arrangement__wrapper">
        <div class="col-md-12">
            <div class="card mb-3 c-arrangement">

                    <draggable-asset 
                        v-for="asset in arrangement.assets" v-bind:key="asset.id"
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

import { mapState, mapActions } from 'vuex'

export default {
    name: 'arrangement',
    components: {
        DraggableAsset
    },
    mounted: function () {

        this.setActiveArrangement(this.arrangements[0])

        // this.getCompSize()
        // const context = this
        // window.addEventListener('resize', function () {
        //     context.getCompSize()
        // })        

    },
    data() {
        return {
            // pWidth: 0,
            // pHeight: 0
        }
    },
    computed: {
        ...mapState('arrangement', ['arrangement', 'arrangements'])
    },
    methods: {
        ...mapActions('arrangement', ['setActiveArrangement']),

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