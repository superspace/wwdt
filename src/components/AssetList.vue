<template>
    <div>
        <b-list-group>
            <b-list-group-item href="#"
                v-for="(asset, id) in assets" :key="id" 
                :setid="asset.id = id"
                @click.prevent="setAsset(asset)" 
                class="d-flex justify-content-between align-items-center">
                <div>
                    <b-icon-file-earmark></b-icon-file-earmark> {{ asset.title }}
                </div>
                <b-button-group>
                    <b-button variant="primary" size="sm" @click.prevent.stop="openUpdateAssetModal(asset)">
                        <b-icon-pencil></b-icon-pencil>
                    </b-button>
                    <!-- <b-button variant="light" size="sm" @click.prevent.stop=""><b-icon-trash></b-icon-trash></b-button> -->
                </b-button-group>
            </b-list-group-item>
        </b-list-group>
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

        openUpdateAssetModal: function (asset) {
            this.setTmpAsset(asset)
            this.$bvModal.show('modal-update-asset')  
        },

    }
}
</script>
