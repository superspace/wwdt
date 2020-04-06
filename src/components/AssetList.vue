<template>
    <div>
        <asset :asset="data"></asset>

        <b-list-group>
            <span v-for="asset in assetList" :key="asset.id">
                <b-list-group-item class="d-flex justify-content-between align-items-center">
                    <div>
                        {{ asset.title }}
                        <b-badge variant="primary" pill>{{ asset.type }} </b-badge>
                    </div>
                    <b-button-group>
                        <b-button variant="primary" size="sm" @click.prevent="openUpdateAssetModal(asset)">
                            <b-icon-pencil></b-icon-pencil>
                        </b-button>
                        <b-button variant="light" size="sm" ><b-icon-trash></b-icon-trash></b-button>
                    </b-button-group>
                </b-list-group-item>
            </span>
        </b-list-group>
    </div>
</template>

<script>

import { mapState, mapActions, mapGetters } from 'vuex'

import Asset from '@/components/Asset'

export default {
    name: 'AssetList',
    components: {
        Asset
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
        ...mapActions('assets', []),

        openUpdateAssetModal: function (asset) {
            this.data = Object.assign({}, asset)
            this.$bvModal.show('modal-update-asset')  
        },

    }
}
</script>
