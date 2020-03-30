<template>
    <div>

        <b-alert variant="danger" :show="removeAlert" class="d-flex flex-row justify-content-between">
            <span>Remove <em>{{ asset.title }}</em> from <em>{{ marker.title }}</em> ?</span>
            <b-button variant="danger" size="sm" @click="handleRemoveAsset">OK</b-button>
        </b-alert>

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

                <b-list-group-item class="d-flex justify-content-between align-items-center" 
                    v-for="assetid in marker.assets" :key="assetid" :set="item = getAsset(assetid)">
                    <div>
                        {{ item.title }}
                        <b-badge variant="primary" pill>{{ item.type }} </b-badge>
                    </div>
                    <b-button-group>
                        <b-button variant="primary" size="sm" @click.prevent="openUpdateAssetModal(assetid)">
                            <b-icon-pencil></b-icon-pencil>
                        </b-button>
                        <b-button variant="light" size="sm" @click.prevent="showRemoveAssetAlert(assetid)"><b-icon-x></b-icon-x></b-button>
                    </b-button-group>
                </b-list-group-item>

            </b-list-group>
        </div>    

        <b-modal id="modal-update-asset" size="lg" title="Update Asset" @ok="handleUpdateAssetModalOk">

            <b-form ref="formUpdateAsset" @submit.stop.prevent="handleUpdateAssetSubmit">

                <b-form-group label="Titel" label-for="title" 
                    :state="titleState" 
                    invalid-feedback="Name is required">
                    <b-form-input id="title" v-model="asset.title" type="text" required />
                </b-form-group>

                <b-form-group label="Beschreibung" label-for="description">
                    <b-form-textarea id="description" v-model="asset.description" />
                </b-form-group>

                <b-form-group label="Tags" label-for="tags">
                    <b-form-tags id="tags" v-model="asset.tags" />
                </b-form-group>

                <b-form-group label="Ranking">
                    <b-form-radio-group :options="ranking" v-model="asset.rank">
                    </b-form-radio-group>
                </b-form-group>

                <div v-if="asset.type=='IMAGE'||asset.type=='FILE'">

                    <b-form-file
                        v-model="asset.src"
                        :state="Boolean(asset.src)"
                        placeholder="Datei auswählen oder auf dieses Feld ziehen..."
                        drop-placeholder="Drop file here..."
                    ></b-form-file>

                </div>

                <div v-if="asset.type=='TEXT'">

                    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
                        <button :class="{ 'is-active': isActive.bold() }" @click="commands.bold">Bold</button>
                        <button :class="{ 'is-active': isActive.bold() }" @click="commands.bold">Bold</button>
                    </editor-menu-bar>

                    <editor-content :editor="editor" />

                </div>

            </b-form>

        </b-modal>

        <!-- <b-modal id="modal-delete-asset" title="Delete Asset" @ok="handleDeleteAssetModalOk">


        </b-modal> -->

        <b-modal id="modal-add-asset" size="lg" title="Add Asset" @ok="handleAddAssetModalOk">

            <b-form @submit.stop.prevent="">

                <b-form-group label="Titel" label-for="title">
                    <b-form-input id="title" v-model="asset.title" type="text" required />
                </b-form-group>

                <b-form-group label="Beschreibung" label-for="description">
                    <b-form-textarea id="description" v-model="asset.description" />
                </b-form-group>

                <b-form-group label="Art" label-for="type">
                    <b-form-select id="type" v-model="asset.type" :options="types" />
                </b-form-group>

            </b-form>
        </b-modal>

    </div>    
    </div>
</template>

<script>

import { mapState, mapActions, mapGetters } from 'vuex'

import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { Bold, Italic, Link, HardBreak, Heading } from 'tiptap-extensions'

export default {
    name: 'AssetViewer',
    components: {
        EditorContent,
        EditorMenuBar
    },
    data: function () {
        return {
            asset: {},
            editor: new Editor({
                extensions: [
                    new Bold(),
                    new Italic(),
                    new Link(),
                    new HardBreak(),
                    new Heading()
                ],
                content: this.asset ? this.asset.content : '',
            }),   
            types: [
                {value: 'FILE', text: 'Datei (DOC,XLS,PDF)'},
                {value: 'IMAGE', text: 'Bild (JPG,PNG,GIF)'},
                {value: 'TEXT', text: 'Text'},
                {value: 'VIDEO', text: 'Video (MP4)'},
                {value: 'AUDIO', text: 'Audio (MP3)'},
                {value: 'LABEL', text: 'Textlabel'}
            ],
            ranking: [1,2,3,4,5],
            titleState: null,
            removeAlert: false
        }
    },
    beforeDestroy() {
        this.editor.destroy()
    },
    computed: {
        ...mapState('marker', ['markers','marker']),
        ...mapState('timeline', ['start']),
        ...mapState('assets', ['assets']),
        ...mapGetters('assets', ['getAsset']),
    },
    methods: {
        ...mapActions('marker', ['addAsset','removeAsset']),
        ...mapActions('assets', ['updateAsset','deleteAsset']),

        // Update

        assignAsset: function (id) {
            this.asset = Object.assign({}, this.getAsset(id)); 
        },

        openUpdateAssetModal: function (id) {
            this.assignAsset(id)
            this.$bvModal.show('modal-update-asset')
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

            this.updateAsset(this.asset)
                .then(() => {
                    this.asset = {}
                    this.$bvModal.hide('modal-update-asset')
                })

        },

        // Create

        handleAddAssetModalOk: function (e) {
            e.preventDefault()
            this.handleAddAssetSubmit()
        },

        handleAddAssetSubmit: function () {

        },

        // Remove from Marker

        showRemoveAssetAlert: function (id) {
            this.assignAsset(id)
            this.removeAlert = true
        },

        handleRemoveAsset: function () {

            let payload = {
                marker: this.marker,
                id: this.asset.id
            }

            this.removeAsset(payload)
                .then(() => {
                    this.asset = {}
                    this.removeAlert = false
                })   
        },

        // Delete

        openDeleteAssetModal: function (id) {
            this.assignAsset(id)
        },

        handleDeleteAsset: function () {
            this.deleteAsset(this.asset.id)
                .then(() => {
                    this.asset = {}
                    this.deleteAlert = false
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