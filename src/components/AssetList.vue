<template>
    <div>
        <b-card no-body class="mb-3">

            <b-card-header class="d-flex justify-content-between align-items-center">
                <b-form inline>
                    <b-input-group prepend="Stars" size="sm">
                        <template v-slot:prepend>
                            <b-input-group-text>
                                <b-icon-star-fill style="width: 14px; height: 14px;"></b-icon-star-fill>
                            </b-input-group-text>
                        </template>
                        <b-form-select size="sm" v-model="filterRank" :options="rankingOptions" />
                    </b-input-group>
                    <b-input-group label-cols="6" size="sm">
                        <template v-slot:prepend>
                            <b-input-group-text>
                                <b-icon-tag-fill style="width: 14px; height: 14px;"></b-icon-tag-fill>
                            </b-input-group-text>
                        </template>
                        <b-form-select size="sm" v-model="filterTag" :options="tagOptions" />
                    </b-input-group>
                </b-form>
                <b-button-group>
                    <b-button variant="primary" size="sm" @click.prevent="openCreateAssetModal()"><b-icon-plus></b-icon-plus> Add Asset</b-button>
                </b-button-group>

            </b-card-header>

            <b-list-group flush>
                <drag class="list-group-item d-flex justify-content-between align-items-center" href="#"
                    v-for="asset in filteredAssets" :key="asset.id"
                    :transfer-data="asset" 
                    @click.prevent="setAsset(asset)">
                    <div @click.prevent="openViewAssetModal(asset)">
                        <b-icon-file-earmark v-if="asset.type === 'FILE'"></b-icon-file-earmark> 
                        <b-icon-card-image v-if="asset.type === 'IMAGE'"></b-icon-card-image> 
                        <b-icon-volume-up-fill v-if="asset.type === 'AUDIO'"></b-icon-volume-up-fill> 
                        <b-icon-camera-video-fill v-if="asset.type === 'VIDEO'"></b-icon-camera-video-fill> 
                        <b-icon-file-text v-if="asset.type === 'TEXT'"></b-icon-file-text> 
                        
                        {{ asset.title }}
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
            filterRank: -1,
            filterTag: '',
            filterTags: []
        }
    },
    computed: {
        ...mapState('assets', ['tmpAsset', 'ranking']),
        ...mapState('project', ['session']),

        ...mapGetters('assets', ['getAssets']),

        tagOptions: function () {
            let tags = this.session.tags.slice(0)
            tags.unshift({value: '', text: 'All'})
            return tags
        },

        rankingOptions: function () {
            return this.ranking
        },

        filteredAssets: function () {

            let assets = this.getAssets
            
            if (this.filterRank >= 0 || this.filterTag != '') {

                assets = assets.filter(asset => {

                    if (asset.rank == this.filterRank) {
                        return true
                    }
                    if (asset.tags.indexOf(this.filterTag) != -1) {
                        return true
                    }
                })
            }
            
            return assets
        }
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
            this.$bvModal.msgBoxConfirm('Really remove «' + this.tmpAsset.title + '»? This is permanent.')
                .then(value => {
                    if (value === true) {
                        this.deleteAsset(this.tmpAsset.id)
                            .then(() => {
                                this.setTmpAsset()
                            })
                    } 
                })
        },


    }
}
</script>
