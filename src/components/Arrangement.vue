<template>
    <div>
        <div class="row">
            <div class="col-md-12 d-flex justify-content-between align-items-center">
                <h6 v-if="keyframe.id">{{ keyframe.title }} <b-badge variant="secondary"><b-icon-clock></b-icon-clock> {{ $timestamp(start, keyframe.time) }} Uhr</b-badge> </h6>
                <span></span>
                <b-button class="mb-3" size="sm" variant="primary" @click.prevent="openCreateKeyframeModal">
                    <b-icon-plus></b-icon-plus> Add Keyframe
                </b-button>
            </div>
        </div>
        <div class="row c-arrangement__wrapper">
            <div class="col">
                <drop class="card mb-3 c-arrangement"
                    :class="dragOverClass" 
                    @dragover="handleDragOver"
                    @dragleave="dragOver = false"
                    @drop="handleDrop"
                    v-if="arrangement">

                    <draggable-asset 
                        v-for="asset in keyframe.assets" v-bind:key="asset.id" :set="asset.data = getAsset(asset.id)"
                        :asset="asset.data" :props="asset.props">
                    </draggable-asset>

                </drop>
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
            dragOver: false
        }
    },
    computed: {
        ...mapGetters('assets', ['getAsset']),
        ...mapState('arrangement', ['arrangement', 'arrangements']),
        ...mapState('keyframe', ['keyframes','keyframe']),
        ...mapState('timeline', ['start']),

        dragOverClass: function () {
            return this.dragOver ? 'c-arrangement--dragover' : ''
        }
    },
    methods: {
        ...mapActions('arrangement', ['getArrangement']),
        ...mapActions('keyframe', ['setTmpKeyframe','addPropertiesToKeyframe']),

        openCreateKeyframeModal: function () {
            this.setTmpKeyframe()
            this.$bvModal.show('modal-create-keyframe')
        },

        handleDragOver: function (asset, event) {

            if (!this.keyframe.id || this.keyframe.assets.findIndex(x => x.id === asset.id) !== -1) {
                event.dataTransfer.dropEffect = 'none';
            } else {
                this.dragOver = true
            }

        },

        handleDrop: function (asset, event) {

            this.dragOver = false;

            let payload = {
                asset: asset,
                props: {
                    x: event.offsetX,
                    y: event.offsetY,
                    z: 1,
                    scale: 1
                }
            }

            if (this.keyframe.id) {
                this.addPropertiesToKeyframe(payload)
            }

        }

    }
}
</script>

<style lang="scss">

.c-arrangement {
    height: calc(100vh - 340px);

    &--dragover {
        &.card {
            background: var(--light)
        }
    }
}

</style>