<template>
    <div>

    <b-alert variant="danger" :show="showRemoveAssetAlert" class="d-flex flex-row justify-content-between">
        <span>Remove <strong>{{ asset.title }}</strong> from {{ marker.title }} ?</span>
        <b-button-group>
            <b-button variant="danger" size="sm" @click="handleRemoveAsset">Yes</b-button>
            <b-button variant="" size="sm" @click="handleCancelRemoveAsset">No</b-button>
        </b-button-group>
    </b-alert>

    <b-alert variant="danger" :show="showDeleteMarkerAlert" class="d-flex flex-row justify-content-between">
        <span><b-icon-trash></b-icon-trash> Delete <strong>{{ marker.title }}</strong> ?</span>
        <b-button-group>
            <b-button variant="danger" size="sm" @click="handleDeleteMarker">Yes</b-button>
            <b-button variant="" size="sm" @click="handleCancelDeleteMarker">No</b-button>
        </b-button-group>
    </b-alert>

    <b-card no-body class="mb-3" v-if="marker.id">

        <b-card-header class="d-flex justify-content-between align-items-center">
            <div>
                <div>{{marker.title}}</div>
                <b-badge variant="secondary">{{ $timestamp(start, marker.time) }} Uhr</b-badge> 
            </div>
            <b-button-group>
                <b-button variant="primary" size="sm" @click.prevent="openUpdateMarkerModal()">
                    <b-icon-pencil></b-icon-pencil>
                </b-button>
                <b-button variant="light" size="sm" @click.prevent="handleDeleteMarkerAlert()"><b-icon-trash></b-icon-trash></b-button>
                <b-button variant="secondary" size="sm"><b-icon-plus></b-icon-plus> Add Asset</b-button>
            </b-button-group>

        </b-card-header>

        <b-list-group flush>
                <b-list-group-item class="d-flex justify-content-between align-items-center" v-for="id in marker.assets" :key="id" :define="item = getAsset(id)">
                    <div>
                        <b-icon-file-earmark></b-icon-file-earmark> {{ item.title }}
                        <b-badge variant="primary" pill>{{ item.type }} </b-badge>
                    </div>
                    <b-button-group>
                        <b-button variant="primary" size="sm" @click.prevent="openUpdateAssetModal(item)">
                            <b-icon-pencil></b-icon-pencil>
                        </b-button>
                        <b-button variant="light" size="sm" @click.prevent="handleRemoveAssetAlert(item)"><b-icon-x></b-icon-x></b-button>
                    </b-button-group>
                </b-list-group-item>
        </b-list-group>
 
    </b-card>    
        <b-modal id="modal-update-marker" size="md" title="Update Marker" @ok="handleUpdateMarkerModalOK">

            <b-form ref="formUpdateAsset" @submit.stop.prevent="handleUpdateMarkerSubmit">

                <b-form-group label="Titel" label-for="title" 
                    invalid-feedback="Name is required">
                    <b-form-input id="title" v-model="data.title" type="text" required />
                </b-form-group>

                <b-form-group label="Time" label-for="time" 
                    invalid-feedback="Time is required">
                    
                    <b-input-group>
                        <b-form-spinbutton id="time" v-model="data.time" step="1" min="0" :max="duration" required />
                        <b-input-group-append>
                            <b-alert class="p-2" variant="secondary" show><pre class="mb-0"> <b-icon-clock></b-icon-clock> {{ $timestamp(start, data.time) }}</pre></b-alert>
                        </b-input-group-append>
                    </b-input-group>

                </b-form-group>

            </b-form>

        </b-modal>
    </div>
</template>

<script>

import { mapState, mapActions, mapGetters } from 'vuex'

// import Asset from '@/components/Asset'

export default {
    name: 'MarkerEditor',
    components: {
        // Asset
    },
    data: function () {
        return {
            showRemoveAssetAlert: false,
            showDeleteMarkerAlert: false,
            asset: {},
            data: {},
        }
    },
    mounted: function () {
    },
    computed: {
        ...mapState('marker', ['markers','marker']),
        ...mapState('timeline', ['start','duration']),
        ...mapState('assets', ['assets']),
        ...mapGetters('assets', ['getAsset']),

    },
    watch: {
    },
    methods: {
        ...mapActions('marker', ['addAsset','removeAsset','updateMarker','removeMarker']),

        // Update Marker

        openUpdateMarkerModal: function () {
            this.data = Object.assign({}, this.marker)
            this.$bvModal.show('modal-update-marker')
        },

        handleUpdateMarkerModalOK: function (e) {
            e.preventDefault();
            this.handleUpdateMarkerSubmit()

        },

        handleUpdateMarkerSubmit: function () {
            this.updateMarker(this.data)
                .then(() => {
                    this.data = {}
                    this.$bvModal.hide('modal-update-marker')
                })   
        },

        // Delete Marker

        handleDeleteMarkerAlert: function () {
            this.showDeleteMarkerAlert = true
        },

        handleCancelDeleteMarker: function () {
            this.showDeleteMarkerAlert = false
        },

        handleDeleteMarker: function () {
            const data = {
                marker: this.marker
            }

            this.removeMarker(data)
                .then(() => {
                    this.showDeleteMarkerAlert = false
                })   

        },

        // Remove Asset

        handleRemoveAssetAlert: function (asset) {
            this.asset = asset
            this.showRemoveAssetAlert = true
        },

        handleCancelRemoveAsset: function () {
            this.asset = {}
            this.showRemoveAssetAlert = false
        },

        handleRemoveAsset: function () {

            const data = {
                marker: this.marker,
                id: this.asset.id
            }

            this.removeAsset(data)
                .then(() => {
                    this.asset = {}
                    this.showRemoveAssetAlert = false
                })   
        },


        // Create

        handleAddAssetModalOk: function (e) {
            e.preventDefault()
            this.handleAddAssetSubmit()
        },

        handleAddAssetSubmit: function () {
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