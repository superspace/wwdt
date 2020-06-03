<template>
    <div>

        <b-modal id="modal-view-asset" :title="asset.title" :scrollable="true" :hide-footer="true" :no-stacking="true">

            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <b-badge class="mr-1" variant="secondary" v-for="tag in asset.tags" :key="tag">{{tag}}</b-badge>
                </div>

                <div class="d-flex justify-content-between align-items-start">
                    <span v-for="i in 5" :key="i" class="pl-1">
                        <b-icon-star-fill variant="secondary" v-if="i <= asset.rank"></b-icon-star-fill>
                        <b-icon-star-fill variant="light" v-if="i > asset.rank"></b-icon-star-fill>
                    </span>
                </div>
                <b-button variant="primary" size="sm" @click.prevent.stop="openUpdateAssetModal(asset)">
                    <b-icon-pencil></b-icon-pencil>
                </b-button>

            </div>


            <p>{{ asset.description }}</p>

            <figure v-if="src">
                <img :src="src" :alt="asset.title" class="img-fluid" />
            </figure>

            <div v-if="asset.type === 'VIDEO'" class="mb-3">
                <video-js :src="src" :type="asset.file.type"></video-js>
            </div>

            <div v-if="asset.type === 'AUDIO'" class="mb-3">
                <audio-player :src="src"></audio-player>
            </div>

            <div v-if="asset.type == 'TEXT'" v-html="asset.content"></div>

            <a v-if="asset.type == 'URL'" :href="asset.content" target="_blank">{{ asset.content }}</a>

            <b-button :href="src" size="sm" variant="primary" v-if="src" target="_blank">
                <b-icon-file-earmark></b-icon-file-earmark> Download
            </b-button>

            <div class="pt-3">
                <small>Created {{ asset.creationdate | moment('DD.MM.YYYY HH:mm:ss')}} by {{asset.author}}</small>
            </div>

        </b-modal>

    </div>
</template>

<script>

import VideoJS from '@/components/VideoJS'
import AudioPlayer from '@/components/AudioPlayer'

import { mapState, mapActions } from 'vuex'

export default {
    name: 'AssetViewer',
    components: {
        VideoJs: VideoJS,
        AudioPlayer
    },
    computed: {
        ...mapState('assets', ['tmpAsset', 'asset']),

        src: function () {
            return (this.asset.file && this.asset.file.preview) ? process.env.VUE_APP_ADMIN_HOST + this.asset.file.preview : ''
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