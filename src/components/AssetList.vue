<template>
    <div>
        <b-list-group>
            <b-list-group-item href="#"
                @click.prevent="setAsset(asset)" 
                v-for="asset in assetList" :key="asset.id" 
                class="d-flex justify-content-between align-items-center">
                <div>
                    <b-icon-file-earmark></b-icon-file-earmark> {{ asset.title }}
                </div>
                <b-button-group>
                    <b-button variant="primary" size="sm" @click.prevent.stop="openUpdateAssetModal(asset)">
                        <b-icon-pencil></b-icon-pencil>
                    </b-button>
                    <b-button variant="light" size="sm" @click.prevent.stop=""><b-icon-trash></b-icon-trash></b-button>
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

        assetList: function () {

            let out = [];

            for (var key in this.assets) {
                let asset = this.getAsset(key)
                asset['id'] = key
                out.push(asset)
            }

            return out
        }
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
