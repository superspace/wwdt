<template>
    <div>

        <b-modal id="modal-update-asset" size="lg" :scrollable="true" title="" @hidden="handleHideModal" @ok="handleUpdateAssetModalOk">
            <b-overlay :show="inProgress">
                <b-form ref="formUpdateAsset" @submit.stop.prevent="handleUpdateAssetSubmit">

                    <div class="row">
                        <div class="col-md-6">

                            <b-form-group label="Type" label-for="type">
                                <b-form-select id="type" v-model="tmpAsset.type" :options="types" required />
                            </b-form-group>

                            <b-form-group label="Titel" label-for="title" 
                                :state="titleState" 
                                invalid-feedback="Title is required">
                                <b-form-input id="title" v-model="tmpAsset.title" type="text" required />
                            </b-form-group>

                            <b-form-group label="Beschreibung" label-for="description">
                                <b-form-textarea id="description" v-model="tmpAsset.description" />
                            </b-form-group>

                            <b-form-group label="Tags" label-for="tags">
                                <b-form-tags id="tags" v-model="tmpAsset.tags" />
                            </b-form-group>

                            <b-form-group label="Ranking">
                                <b-form-radio-group :options="ranking" v-model="tmpAsset.rank">
                                </b-form-radio-group>
                            </b-form-group>

                        </div>
                        <div class="col-md-6">

                            <div v-if="['IMAGE','FILE','AUDIO','VIDEO'].includes(tmpAsset.type)">

                                <b-form-group label="Upload" label-for="file">
                                    <b-form-file
                                        v-model="tmpAsset.upload"
                                        id="file"
                                        placeholder="Select file ..."
                                        drop-placeholder="Drop file here..."
                                        @input="handleFilePreview()"
                                    ></b-form-file>
                                </b-form-group>

                                <div class="card mb-4" v-if="preview">
                                    <div class="card-body">
                                    <img :src="preview" class="img-fluid" />
                                    </div>
                                </div>

                                <small v-if="filename"><b-icon-file-earmark></b-icon-file-earmark> {{ filename }}</small>

                            </div>

                            <div v-if="tmpAsset.type=='URL'">
                                <b-form-group label="URL" label-for="content">
                                    <b-form-input id="content" v-model="tmpAsset.content" type="url" required />
                                </b-form-group>
                            </div>

                            <div v-if="tmpAsset.type=='TEXT'">
                                <vue-editor v-model="tmpAsset.content" :editorToolbar="customToolbar"></vue-editor>
                            </div>

                        </div>
                    </div>

                </b-form>
            </b-overlay>
        </b-modal>

    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

import { VueEditor } from "vue2-editor";

export default {
    name: 'AssetEditor',
    components: {
        VueEditor
    },
    props: {
    },
    mounted: function () {
    },
    data: function () {
        return {
            titleState: null,
            inProgress: false,
            uploadSrc: '',
            uploadFilename: '',
            customToolbar: [
                [{ 'header': [1, 2, 3, 4, false] }],
                ["bold", "italic", "underline"], 
                [{ list: "ordered" }, { list: "bullet" }], 
                ["code-block"]
            ]
        }
    },
    watch: {
    },
    computed: {
        ...mapState('assets', ['tmpAsset', 'types', 'ranking']),
        ...mapState('marker', ['marker']),
        ...mapGetters('assets', ['allowedFileTypes']),

        filename: function () {

            let filename = ''

            if (this.tmpAsset.file && this.tmpAsset.file.src) {
                filename = this.tmpAsset.file.src.split('/').pop()
            }
            
            filename = this.uploadFilename ? this.uploadFilename : filename

            return filename
        },

        preview: function () {
            let src = (this.tmpAsset.file && this.tmpAsset.file.thumb) ? process.env.VUE_APP_ADMIN_HOST + this.tmpAsset.file.thumb : ''
            return this.uploadSrc ? this.uploadSrc : src
        }
    },
    methods: {

        ...mapActions('assets', ['updateAsset','deleteAsset', 'createAsset', 'setTmpAsset']),

        reset: function () {
            this.setTmpAsset()
            this.titleState = null
            this.inProgress = false
            this.uploadSrc =  ''
            this.uploadFilename =  ''
        },

        handleFilePreview: function () {

            let reader = new FileReader();
            reader.addEventListener(
                "load",
                function () {
                    this.uploadSrc = reader.result
                }.bind(this),
                false
            );

            if (this.tmpAsset.upload) {
                this.uploadFilename = this.tmpAsset.upload.name
                if (/\.(jpe?g|png|gif)$/i.test(this.tmpAsset.upload.name)) {
                    reader.readAsDataURL(this.tmpAsset.upload)
                }
            }

        },

        checkUpdateAssetValidity: function () {
            const valid = this.$refs.formUpdateAsset.checkValidity()
            this.titleState = valid
            return valid
        },

        handleUpdateAssetModalOk: function (e) {
            e.preventDefault();
            this.handleUpdateAssetSubmit()
        },

        handleUpdateAssetSubmit: function () {
        
            if (!this.checkUpdateAssetValidity()) {
                return
            }

            this.inProgress = true;

            if (this.tmpAsset.id == undefined) {

                let payload = {
                    asset: this.tmpAsset,
                    marker: this.marker.id ? this.marker : 0
                }

                this.createAsset(payload)
                    .then(() => {
                        this.$bvModal.hide('modal-update-asset')
                        this.inProgress = false;
                    })

            } else {

                this.updateAsset(this.tmpAsset)
                    .then(() => {
                        this.$bvModal.hide('modal-update-asset')
                        this.inProgress = false;
                    })

            }

        },

        handleHideModal: function () {
            this.reset()
        }

    }
    
}
</script>