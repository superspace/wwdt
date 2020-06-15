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
                <b-form inline class="mb-3">
                    <span v-if="this.sessionMode == this.MODE_EDIT">
                        <b-form-select v-model="arrangement.id" :options="arrangementsAsOptions" size="sm" @change="handleChangeArrangement"></b-form-select>
                        <b-button  size="sm" class="ml-3" variant="primary" @click.prevent="openCreateArrangementModal">
                            <b-icon-plus></b-icon-plus> Add Arrangement
                        </b-button>
                    </span>
                    <b-button  size="sm" class="ml-3" variant="primary" @click.prevent="openCreateKeyframeModal" v-if="hasEditPermission">
                        <b-icon-plus></b-icon-plus> Add Keyframe
                    </b-button>
                </b-form>
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

        <b-modal id="modal-create-arrangement" title="Add Arrangement" @ok="handleCreateArrangementModalOK">

            <b-form @submit.stop.prevent="handleCreateArrangementSubmit">

                <b-form-group label="Title" label-for="title" 
                    invalid-feedback="Title is required">
                    <b-form-input id="title" v-model="tmpArrangement.title" type="text" required />
                </b-form-group>

            </b-form>

        </b-modal>

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
        ...mapGetters('user', ['hasEditPermission']),
        ...mapGetters('project', ['sessionMode']),

        ...mapState('arrangement', ['arrangement', 'arrangements','tmpArrangement']),
        ...mapState('keyframe', ['keyframes','keyframe']),
        ...mapState('timeline', ['start', 'time']),
        ...mapState('project', ['MODE_EDIT', 'MODE_RECORD']),

        dragOverClass: function () {
            return this.dragOver ? 'c-arrangement--dragover' : ''
        },

        active: function () {
            return this.time > 0;
        },

        arrangementsAsOptions: function () {
            let options = []
            for (const arrangement of this.arrangements) {
                let option = {
                    value: arrangement.id,
                    text: arrangement.title
                }
                options.push(option)
            }
            return options
        }
    },
    methods: {
        ...mapActions('arrangement', ['getArrangement', 'setTmpArrangement', 'createArrangement']),
        ...mapActions('keyframe', ['setTmpKeyframe','addPropertiesToKeyframe']),

        getProp: function (asset, prop) {
            return asset.props[prop]
        },

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

        handleDrop: function (asset) {

            this.dragOver = false;

            const xpos = event.offsetX - this.dropzone.width / 2
            const ypos = event.offsetY - this.dropzone.width / 2

            const x = Math.round(100 / this.dropzone.width / 2 * xpos * 100) / 100
            const y = Math.round(100 / this.dropzone.height / 2 * ypos * 100) / 100

            if (this.keyframe.id) {

                let payload = {
                    assetId: asset.id,
                    keyframeId: this.keyframe.id,
                    props: {
                        x: x,
                        y: y,
                        z: 1,
                        scale: 1
                    }
                }

                this.addPropertiesToKeyframe(payload)
                    .then(()=> {

                    })
            }

        },
        handleChangeArrangement: function () {
            this.getArrangement(this.arrangement.id)
        },

        openCreateArrangementModal: function () {
            this.setTmpArrangement()
            this.$bvModal.show('modal-create-arrangement')
        },

        handleCreateArrangementModalOK: function (e) {
            e.preventDefault();
            this.handleCreateArrangementSubmit()

        },

        handleCreateArrangementSubmit: function () {
            this.createArrangement(this.tmpArrangement)
                .then(() => {
                    this.setTmpArrangement()
                    this.$bvModal.hide('modal-create-arrangement')
                })

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