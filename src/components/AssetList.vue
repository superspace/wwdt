<template>
    <div>
        <b-alert variant="danger" :show="showDeleteAssetAlert" class="d-flex flex-row justify-content-between">
            <span>Remove <strong>{{ tmpAsset.title }}</strong>? It will be permanently removed everywhere.</span>
            <b-button-group>
                <b-button variant="danger" size="sm" @click="handleDeleteAsset">Yes</b-button>
                <b-button variant="" size="sm" @click="handleCancelDeleteAsset">No</b-button>
            </b-button-group>
        </b-alert>

        <b-card no-body class="mb-3">

            <b-card-header class="d-flex justify-content-between align-items-center">
                <div></div>
                <b-button-group>
                    <b-button variant="primary" size="sm" @click.prevent="openCreateAssetModal()"><b-icon-plus></b-icon-plus> Add Asset</b-button>
                </b-button-group>

            </b-card-header>

            <b-list-group flush>
                <drag class="list-group-item d-flex justify-content-between align-items-center" href="#"
                    v-for="(asset, id) in assets" :key="id"
                    :setid="asset.id = id"
                    :transfer-data="asset" 
                    @click.prevent="setAsset(asset)">
                    <div @click.prevent="openViewAssetModal(asset)">
                        <b-icon-file-earmark></b-icon-file-earmark> {{ asset.title }}
                    </div>
                    <b-button-group>
                        <b-button variant="primary" size="sm" @click.prevent.stop="openUpdateAssetModal(asset)">
                            <b-icon-pencil></b-icon-pencil>
                        </b-button>
                        <b-button variant="light" size="sm" @click.prevent.stop="handleDeleteAssetAlert(asset)"><b-icon-trash></b-icon-trash></b-button>
                    </b-button-group>
                </drag>
            </b-list-group>
        </b-card>
    </div>
</template>

<script>

import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    name: 'AssetList',
    components: {
    },
    data: function () {
        return {
            showDeleteAssetAlert: false
        }
    },
    computed: {
        ...mapState('assets', ['assets', 'tmpAsset']),
        ...mapGetters('assets', ['getAsset']),
    },
    methods: {
        ...mapActions('assets', ['setAsset', 'setTmpAsset', 'deleteAsset']),
        ...mapActions('marker', ['setMarker', 'getMarkers']),


        openViewAssetModal: function (asset) {
            this.setAsset(asset)
            this.$bvModal.show('modal-view-asset')  
        },

        openUpdateAssetModal: function (asset) {
            this.setTmpAsset(asset)
            this.$bvModal.show('modal-update-asset')  
        },

        openCreateAssetModal: function () {
            this.setTmpAsset()
            this.setMarker()
            this.$bvModal.show('modal-update-asset')  
        },

        handleDeleteAssetAlert: function (asset) {
            this.setTmpAsset(asset)
            this.showDeleteAssetAlert = true
        },

        handleDeleteAsset: function () {
            this.deleteAsset(this.tmpAsset.id)
                .then(() => {
                    this.setTmpAsset()
                    this.showDeleteAssetAlert = false
                    this.getMarkers()
                })
        },

        handleCancelDeleteAsset: function () {
            this.setTmpAsset()
            this.showDeleteAssetAlert = false
        }

    }
}
</script>
