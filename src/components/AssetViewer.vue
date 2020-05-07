<template>
    <div>
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

        <b-button :href="src" size="sm" variant="primary" v-if="src" target="_blank"><b-icon-file-earmark></b-icon-file-earmark> Download</b-button>

        <div v-if="asset.type == 'TEXT'" v-html="asset.content"></div>

        <a v-if="asset.type == 'URL'" :href="asset.content" target="_blank">{{ asset.content }}</a>
    </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
    name: 'AssetViewer',
    components: {

    },
    computed: {
        ...mapState('assets', ['tmpAsset', 'asset']),

        src: function () {
            return (this.asset.file) ? process.env.VUE_APP_ADMIN_HOST + this.asset.file.src : ''
        },

    },
    methods: {

        ...mapActions('assets', ['setTmpAsset']),

        // Update Asset

        openUpdateAssetModal: function (asset) {
            this.setTmpAsset(asset)
            this.$bvModal.show('modal-update-asset')  
        },

    }
    
}
</script>