<template>
    <div>

        <div class="row">

            <div class="col-md-5">

                <b-alert variant="danger" :show="showRemoveAssetAlert" class="d-flex flex-row justify-content-between">
                    <span>Remove <strong>{{ tmpAsset.title }}</strong> from {{ marker.title }} ?</span>
                    <b-button-group>
                        <b-button variant="danger" size="sm" @click="handleRemoveAsset">Yes</b-button>
                        <b-button variant="" size="sm" @click="handleCancelRemoveAsset">No</b-button>
                    </b-button-group>
                </b-alert>

                <b-alert variant="danger" :show="showDeleteMarkerAlert" class="d-flex flex-row justify-content-between">
                    <span><b-icon-trash></b-icon-trash> Delete <strong>{{ tmpMarker.title }}</strong> ?</span>
                    <b-button-group>
                        <b-button variant="danger" size="sm" @click="handleDeleteMarker">Yes</b-button>
                        <b-button variant="" size="sm" @click="handleCancelDeleteMarker">No</b-button>
                    </b-button-group>
                </b-alert>

                <b-card no-body class="mb-3" v-if="marker.id">

                    <b-card-header class="d-flex justify-content-between align-items-center">
                        <div>
                            {{marker.title}}  <b-badge variant="secondary">{{ $timestamp(start, marker.time) }} Uhr</b-badge> 
                        </div>
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

                    </b-card-header>

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

            <div class="col-md-7" v-if="asset.id">

                    <div class="d-flex justify-content-between align-items-start">

                        <div>
                            <h3>{{ asset.title }}</h3>
                            <b-badge class="mr-1" variant="primary" v-for="tag in asset.tags" :key="tag">{{tag}}</b-badge>
                            <p><small>Added {{ asset.creationdate | moment('DD.MM.YYYY HH:mm:ss')}} by {{asset.author}}</small></p>
                        </div>

                        <b-button variant="primary" size="sm" @click.prevent.stop="openUpdateAssetModal(asset)">
                            <b-icon-pencil></b-icon-pencil>
                        </b-button>

                    </div>

                    <p>{{ asset.description }}</p>

                    <figure v-if="asset.type == 'IMAGE'">
                        <img v-if="src" :src="src" :alt="asset.title" class="img-fluid" />
                    </figure>

                    <a :href="src" v-if="src" target="_blank">Download</a>

                    <div v-html="asset.content"></div>

            
            </div>    
        </div>

        <b-modal id="modal-update-marker" size="md" title="Update Marker" @ok="handleUpdateMarkerModalOK">

            <b-form ref="formUpdateAsset" @submit.stop.prevent="handleUpdateMarkerSubmit">

                <b-form-group label="Titel" label-for="title" 
                    invalid-feedback="Name is required">
                    <b-form-input id="title" v-model="tmpMarker.title" type="text" required />
                </b-form-group>

                <b-form-group label="Time" label-for="time" 
                    invalid-feedback="Time is required">
                    
                    <b-input-group>
                        <b-form-spinbutton id="time" v-model="tmpMarker.time" step="1" min="0" :max="duration" required />
                        <b-input-group-append>
                            <b-alert class="p-2" variant="secondary" show><pre class="mb-0"> <b-icon-clock></b-icon-clock> {{ $timestamp(start, tmpMarker.time) }}</pre></b-alert>
                        </b-input-group-append>
                    </b-input-group>

                </b-form-group>

            </b-form>

        </b-modal>
    </div>
</template>

<script>

import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    name: 'MarkerEditor',
    components: {
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
        ...mapState('timeline', ['start','duration']),
        ...mapState('assets', ['tmpAsset', 'asset']),

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

        src: function () {
            return (this.asset.file) ? process.env.VUE_APP_HOST + this.asset.file.src : ''
        },
    },
    watch: {
    },
    methods: {
        ...mapActions('marker', [
                'addAsset',
                'getAssets',
                'removeAsset',
                'setTmpMarker',
                'updateMarker',
                'removeMarker']),

        ...mapActions('assets', ['setTmpAsset', 'setAsset']),

        // Update Marker

        openUpdateMarkerModal: function () {
            this.setTmpMarker(this.marker)
            this.$bvModal.show('modal-update-marker')
        },

        handleUpdateMarkerModalOK: function (e) {
            e.preventDefault();
            this.handleUpdateMarkerSubmit()

        },

        handleUpdateMarkerSubmit: function () {
            this.updateMarker(this.tmpMarker)
                .then(() => {
                    this.setTmpMarker({})
                    this.$bvModal.hide('modal-update-marker')
                })   
        },

        // Delete Marker

        handleDeleteMarkerAlert: function () {
            this.setTmpMarker(this.marker)
            this.showDeleteMarkerAlert = true
        },

        handleCancelDeleteMarker: function () {
            this.setTmpMarker({})
            this.showDeleteMarkerAlert = false
        },

        handleDeleteMarker: function () {
            const data = {
                id: this.tmpMarker.id
            }

            this.removeMarker(data)
                .then(() => {
                    this.setTmpMarker({})
                    this.showDeleteMarkerAlert = false
                })   

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

        // Update Asset

        openUpdateAssetModal: function (asset) {
            this.setTmpAsset(asset)
            this.$bvModal.show('modal-update-asset')  
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