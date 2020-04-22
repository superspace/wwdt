<template>
    <div>
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

            <div class="col-md-8">

                <b-alert variant="danger" :show="showRemoveAssetAlert" class="d-flex flex-row justify-content-between">
                    <span>Remove <strong>{{ tmpAsset.title }}</strong> from {{ marker.title }} ?</span>
                    <b-button-group>
                        <b-button variant="danger" size="sm" @click="handleRemoveAsset">Yes</b-button>
                        <b-button variant="" size="sm" @click="handleCancelRemoveAsset">No</b-button>
                    </b-button-group>
                </b-alert>

                <b-card no-header no-body class="mb-3" v-if="marker.id">

                    <b-list-group flush>
                            <b-list-group-item href="#" 
                                @click.prevent="setAsset(item)"
                                class="d-flex justify-content-between align-items-center" 
                                v-for="item in markerAssets" :key="item.id">
                                <div>
                                    <b-icon-file-earmark></b-icon-file-earmark> {{ item.title }}
                                </div>
                                <b-button-group>
                                    <b-button variant="light" size="sm" @click.prevent.stop="handleRemoveAssetAlert(item)">
                                        <b-icon-x></b-icon-x>
                                    </b-button>
                                </b-button-group>
                            </b-list-group-item>
                    </b-list-group>

                </b-card>    

            </div>

            <div class="col-md-4" v-if="asset.id">

                <b-card>

                <asset-viewer></asset-viewer>

                </b-card>
            
            </div>    
        </div>

    </div>
</template>

<script>

import { mapState, mapActions, mapGetters } from 'vuex'

import AssetViewer from "@/components/AssetViewer";

export default {
    name: 'MarkerList',
    components: {
        AssetViewer
    },
    data: function () {
        return {
            showRemoveAssetAlert: false,
            showDeleteMarkerAlert: false,
        }
    },
    mounted: function () {
    },
    computed: {
        ...mapState('marker', ['markers','tmpMarker','marker',]),
        ...mapState('assets', ['tmpAsset', 'asset']),
        ...mapState('timeline', ['start']),

        ...mapGetters('assets', ['getAsset']),

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
                'setDeleteMarkerAlert']),

        ...mapActions('assets', ['setTmpAsset', 'setAsset']),

        // Delete Marker

        handleDeleteMarkerAlert: function () {
            this.setTmpMarker(this.marker)
            this.setDeleteMarkerAlert(true)
        },


        // Remove Asset

        handleRemoveAssetAlert: function (asset) {
            this.setTmpAsset(asset)
            this.showRemoveAssetAlert = true
        },

        handleCancelRemoveAsset: function () {
            this.setTmpAsset()
            this.showRemoveAssetAlert = false
        },

        handleRemoveAsset: function () {

            const data = {
                marker: this.marker,
                id: this.tmpAsset.id
            }

            this.removeAsset(data)
                .then(() => {
                    this.setTmpAsset()
                    this.showRemoveAssetAlert = false
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

<style lang="scss">

.card-fixed-height {
    height: 200px;
    overflow-y: scroll
}

</style>