<template>
    <div>
        <div class="row">
            <div class="col-md-12 d-flex justify-content-between align-items-center">
                <h6 v-if="keyframe.id">{{ keyframe.title }} 
                    <b-badge variant="secondary">
                        <b-icon-clock></b-icon-clock> {{ $timestamp(start, keyframe.time) }} Uhr
                    </b-badge>
                </h6>
                <span></span>
                <b-button class="mb-3" size="sm" variant="primary" @click.prevent="openCreateKeyframeModal">
                    <b-icon-plus></b-icon-plus> Add Keyframe
                </b-button>
            </div>
        </div>
        <div class="row c-arrangement__wrapper">
            <div class="col">
                <drop class="card mb-3 c-arrangement" ref="arrangement"
                    :class="dragOverClass" 
                    @dragover="handleDragOver"
                    @dragleave="dragOver = false"
                    @drop="handleDrop"
                    v-if="arrangement">

                    <draggable-asset 
                        v-for="asset in keyframe.assets" 
                        :key="asset.id" 
                        :set="asset.data = getAsset(asset.id)"
                        :asset="asset.data" 
                        :parent="dropzone"
                        :props="asset.props">
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
        if (this.arrangements.length > 0) {
            this.getArrangement(this.arrangements[0]['id'])
        }
        this.setParentSize()
        window.addEventListener('resize', this.setParentSize)
    },
    data: function () {
        return {
            dragOver: false,
            dropzone: {
                width: 0,
                height: 0
            }
        }
    },
    computed: {
        ...mapGetters('assets', ['getAsset']),
        ...mapState('arrangement', ['arrangement', 'arrangements']),
        ...mapState('keyframe', ['keyframes','keyframe']),
        ...mapState('timeline', ['start', 'time']),

        dragOverClass: function () {
            return this.dragOver ? 'c-arrangement--dragover' : ''
        },

        active: function () {
            return this.time > 0;
        }
    },
    methods: {
        ...mapActions('arrangement', ['getArrangement']),
        ...mapActions('keyframe', ['setTmpKeyframe','addPropertiesToKeyframe']),

        openCreateKeyframeModal: function () {
            this.setTmpKeyframe()
            this.$bvModal.show('modal-create-keyframe')
        },

        setParentSize: function () {
            if (this.$refs.arrangement) {
                this.dropzone.width = this.$refs.arrangement.$el.offsetWidth
                this.dropzone.height = this.$refs.arrangement.$el.offsetHeight
            }
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

            // let x = Math.round((event.offsetX - this.dropzone.width / 2)/10)*10
            // let y = Math.round((event.offsetY - this.dropzone.height / 2)/10)*10

            const relativeX = Math.round(100 / this.dropzone.width / 2 * event.offsetX * 100) / 100
            const relativeY = Math.round(100 / this.dropzone.height / 2 * event.offsetY * 100) / 100


            let payload = {
                asset: asset,
                props: {
                    x: relativeX,
                    y: relativeY,
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
    overflow: hidden;

    &:before {
        content: "\0020";
        position: absolute;
        display: block;
        left: 30px;
        right: 30px;
        top: 50%;
        border-bottom: 1px solid transparentize(black, 0.85);
    }
    &:after {
        content: "\0020";
        position: absolute;
        display: block;
        top: 30px;
        bottom: 30px;
        right: 50%;
        border-left: 1px solid transparentize(black, 0.85);
    }

    &--dragover {
        &.card {
            background: var(--light)
        }
    }
}

</style>