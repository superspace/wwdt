<template>
    <div>
        <b-card no-body class="mb-3">
            <b-card-header class="d-flex justify-content-between align-items-center">
                <div>
                </div>
                <b-button-group>
                    <b-button variant="primary" size="sm" @click.prevent="openCreateAssetModal()"><b-icon-plus></b-icon-plus> Add Asset</b-button>
                </b-button-group>

            </b-card-header>
                    <!-- @drag="onDrag(asset)" -->

            <b-list-group flush>
                <drag class="list-group-item d-flex justify-content-between align-items-center" href="#"
                    v-for="(asset, id) in assets" :key="id"
                    :setid="asset.id = id"
                    :transfer-data="asset" 
                    @click.prevent="setAsset(asset)">
                    <div>
                        <b-icon-file-earmark></b-icon-file-earmark> {{ asset.title }}
                    </div>
                    <b-button-group>
                        <b-button variant="primary" size="sm" @click.prevent.stop="openUpdateAssetModal(asset)">
                            <b-icon-pencil></b-icon-pencil>
                        </b-button>
                        <!-- <b-button variant="light" size="sm" @click.prevent.stop=""><b-icon-trash></b-icon-trash></b-button> -->
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
            data: {}
        }
    },
    computed: {
        ...mapState('assets', ['assets']),
        ...mapGetters('assets', ['getAsset']),
    },
    methods: {
        ...mapActions('assets', ['setAsset', 'setTmpAsset']),
        ...mapActions('marker', ['setMarker']),

        openUpdateAssetModal: function (asset) {
            this.setTmpAsset(asset)
            this.$bvModal.show('modal-update-asset')  
        },

        openCreateAssetModal: function () {
            this.setTmpAsset()
            this.setMarker()
            this.$bvModal.show('modal-update-asset')  
        },

        onDrag: function () {

            
            // console.log(asset); // eslint-disable-line no-console
        }

    }
}
</script>
