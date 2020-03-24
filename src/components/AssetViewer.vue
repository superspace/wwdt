<template>

    <div class="card mb-3" v-if="marker.title">
        <div class="card-header d-flex justify-content-between align-items-center">
            <div>
                    <div>{{marker.title}}</div>
                    <b-badge variant="secondary">{{marker.time * 1000 + start | moment("HH:mm:ss")}} Uhr</b-badge> 
            </div>
            <b-button-group>
                <b-button variant="primary" size="sm"><b-icon-pencil></b-icon-pencil></b-button>
                <b-button variant="light" size="sm"><b-icon-trash></b-icon-trash></b-button>
                <b-button vaiant="secondary" size="sm" v-b-modal.modal-add-asset><b-icon-plus></b-icon-plus> Add Asset</b-button>
            </b-button-group>

        </div>

        <div class="card-body">
            <b-list-group>

                <b-list-group-item class="d-flex justify-content-between align-items-center" v-for="asset in marker.assets" :key="asset.index">
                    <div>
                        {{asset.title}}
                        <b-badge variant="primary" pill>{{ asset.type }}</b-badge>
                    </div>
                    <b-button-group>
                        <b-button variant="primary" size="sm"><b-icon-pencil></b-icon-pencil></b-button>
                        <b-button variant="light" size="sm"><b-icon-trash></b-icon-trash></b-button>
                    </b-button-group>
                </b-list-group-item>

            </b-list-group>
        </div>    

        <b-modal id="modal-add-asset" title="Add Asset" @ok="handleAddAssetModalOk">

            <b-form @submit.stop.prevent="handleAddAssetSubmit">

                <b-form-group
                    label="Name"
                    label-for="title">
                    <b-form-input
                        id="title"
                        v-model="asset.title"
                        type="text"
                        required
                    ></b-form-input>
                </b-form-group>

                <b-form-file
                v-model="asset.src"
                :state="Boolean(asset.src)"
                placeholder="Datei auswählen oder auf dieses Feld ziehen..."
                drop-placeholder="Drop file here..."
                ></b-form-file>


            </b-form>
        </b-modal>

    </div>    
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
    name: 'AssetViewer',
    data: function () {
        return {
            asset: {}
        }
    },
    computed: {
        ...mapState('marker', ['markers','marker']),
        ...mapState('timeline', ['start']),
    },
    methods: {
        ...mapActions('marker', ['addAsset']),

        handleAddAssetModalOk: function (e) {
            e.preventDefault();
            this.handleAddAssetSubmit()
        },

        handleAddAssetSubmit: function () {

            this.asset.src = ''
            this.asset.type = 'PDF'

            this.addAsset(this.asset);

            this.asset = {};

            this.$nextTick(() => {
                this.$bvModal.hide('modal-add-asset')
            })

        }

    }
}
</script>

<style lang="scss">

.card-fixed-height {
    height: 200px;
    overflow-y: scroll
}

</style>