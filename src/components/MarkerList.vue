<template>
    <div v-if="active">
        <div class="row">
            <div class="col-md-12 mb-4 d-flex justify-content-between align-items-center" v-if="marker.id">
                <h6>
                    {{marker.title}}  <b-badge variant="secondary"><b-icon-clock></b-icon-clock> {{ $timestamp(start, marker.time) }} Uhr</b-badge> 
                </h6>
                
                <b-button-group>
                    <b-button variant="primary" size="sm" @click.prevent="openUpdateMarkerModal">
                        <b-icon-pencil></b-icon-pencil>
                    </b-button>
                    <b-button variant="light" size="sm" @click.prevent="handleDeleteMarkerAlert">
                        <b-icon-trash></b-icon-trash>
                    </b-button>
                    <b-button variant="primary" size="sm" @click.prevent="openCreateAssetModal">
                        <b-icon-plus></b-icon-plus> Add Asset
                    </b-button>
                    <b-button size="sm" class="ml-3" variant="primary" @click.prevent="openCreateMarkerModal">
                        <b-icon-plus></b-icon-plus> Add Marker
                    </b-button>
                </b-button-group>

            </div>
            <div class="col-md-12 mb-4 d-flex justify-content-end align-items-center" v-if="!marker.id">
                <b-button-group>
                    <b-button size="sm" variant="primary" @click.prevent="openCreateMarkerModal">
                        <b-icon-plus></b-icon-plus> Add Marker
                    </b-button>
                </b-button-group>
            </div>
        </div>

        <div class="row">

            <div class="col-md-12">

                <drop no-header no-body class="card p-3 c-marker-list" 
                    :class="dragOverClass" 
                    @dragover="handleDragOver"
                    @dragleave="dragOver = false"
                    @drop="handleDrop"
                    v-if="marker.id">

                        <b-card-group columns>

                            <b-card class="c-card" no-body v-for="item in markerAssets" :key="item.id">

                                <b-button-group>
                                    <b-button variant="light" size="sm" @click.prevent.stop="handleRemoveAsset(item)">
                                        <b-icon-x></b-icon-x>
                                    </b-button>
                                </b-button-group>

                                <b-card-img
                                    @click.prevent="openViewAssetModal(item)"
                                    v-if="item.type === 'IMAGE'"
                                    :src="host + item.file.thumb"
                                    :alt="item.title"></b-card-img>

                                <b-card-body 
                                    @click.prevent="openViewAssetModal(item)"
                                    :title="item.title"
                                    :sub-title="item.description">

                                </b-card-body>

                                <div v-if="item.type === 'VIDEO'">
                                    <video-js :src="host + item.file.src" :type="item.file.type"></video-js>
                                </div>


                            </b-card>

                        </b-card-group>

                </drop>    

            </div>

        </div>

    </div>
</template>

<script>

import { mapState, mapActions, mapGetters } from 'vuex'

import VideoJS from '@/components/VideoJS'

export default {
    name: 'MarkerList',
    components: {
        VideoJs: VideoJS
    },
    data: function () {
        return {
            dragOver: false
        }
    },
    mounted: function () {
    },
    computed: {
        ...mapState('marker', ['markers','tmpMarker','marker',]),
        ...mapState('assets', ['tmpAsset', 'asset']),
        ...mapState('timeline', ['start', 'time']),

        ...mapGetters('assets', ['getAsset']),

        host: function () {
            return process.env.VUE_APP_ADMIN_HOST
        },

        active: function () {
            return this.time > 0;
        },

        dragOverClass: function () {
            return this.dragOver ? 'c-card--dragover' : ''
        },

        markerAssets: function () {
            let assets = [];
            for (var id of this.marker.assets) {
                let asset = this.getAsset(id)
                asset['id'] = id
                assets.push(asset)
            }
            return assets
        },

    },
    watch: {
    },
    methods: {
        ...mapActions('marker', [
                'addAsset',
                'removeAsset',
                'setTmpMarker',
                'deleteMarker'
                ]),

        ...mapActions('assets', ['setTmpAsset', 'setAsset']),

        openViewAssetModal: function (asset) {
            this.setAsset(asset)
            this.$bvModal.show('modal-view-asset')  
        },

        openUpdateAssetModal: function (asset) {
            this.setTmpAsset(asset)
            this.$bvModal.show('modal-update-asset')  
        },

        // Delete Marker

        handleDeleteMarkerAlert: function () {
                this.setTmpMarker(this.marker)
                this.$bvModal.msgBoxConfirm('Really remove «' + this.tmpMarker.title + '»?')
                    .then(value => {
                        if (value === true) {
                            this.deleteMarker(this.tmpMarker.id)
                                .then(() => {
                                    this.setTmpMarker()
                                })
                        } 
                    })

        },

        // Add Asst per drag'n'drop

        handleDragOver: function (asset, event) {
            
            if (this.marker.assets.findIndex(x => x === asset.id) !== -1) {
                event.dataTransfer.dropEffect = 'none';
            } else {
                this.dragOver = true
            }

        },

        handleDrop: function (asset) {

            this.dragOver = false;

            let payload = {
                marker: this.marker,
                id: asset.id
            }

            if (this.marker.id) {
                this.addAsset(payload)
            }

        },

        // Remove Asset

        handleRemoveAsset: function (asset) {
            this.setTmpAsset(asset)

            const data = {
                marker: this.marker,
                id: this.tmpAsset.id
            }

            this.removeAsset(data)
                .then(() => {
                    this.setTmpAsset()
                })   
        },

        // Create Asset

        openCreateAssetModal: function () {
            this.setTmpAsset()
            this.$bvModal.show('modal-update-asset')  
        },

        // Create Marker

        openCreateMarkerModal: function () {
            this.setTmpMarker()
            this.$bvModal.show('modal-create-marker')  
        },

        // Update Marker

        openUpdateMarkerModal: function () {
            this.setTmpMarker(this.marker)
            this.$bvModal.show('modal-update-marker')
        },

    }
}
</script>

<style lang="scss" scoped>

.c-card--dragover {
    background: var(--light)
}

</style>