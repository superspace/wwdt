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

                <b-list-group-item class="d-flex justify-content-between align-items-center" 
                    v-for="assetid in marker.assets" :key="assetid" :set="item = getAsset(assetid)">
                    <div>
                        {{ item.title }}
                        <b-badge variant="primary" pill>{{ item.type }} </b-badge>
                    </div>
                    <b-button-group>
                        <b-button variant="primary" size="sm" @click.prevent="handleUpdateAssetModal(assetid)">
                            <b-icon-pencil></b-icon-pencil>
                        </b-button>
                        <b-button variant="light" size="sm"><b-icon-trash></b-icon-trash></b-button>
                    </b-button-group>
                </b-list-group-item>

            </b-list-group>
        </div>    

        <b-modal id="modal-update-asset" title="Update Asset" @ok="handleUpdateAssetModalOk">

            <b-form @submit.stop.prevent="">

                <b-form-group label="Titel" label-for="title">
                    <b-form-input id="title" v-model="asset.title" type="text" required />
                </b-form-group>

                <b-form-group label="Beschreibung" label-for="description">
                    <b-form-textarea id="description" v-model="asset.description" />
                </b-form-group>

                <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
                    <button :class="{ 'is-active': isActive.bold() }" @click="commands.bold">Bold</button>
                    <button :class="{ 'is-active': isActive.bold() }" @click="commands.bold">Bold</button>
                </editor-menu-bar>

                <editor-content :editor="editor" />

                <!-- <b-form-group label="Inhalt" label-for="content">
                </b-form-group> -->

            </b-form>

        </b-modal>

        <b-modal id="modal-add-asset" title="Add Asset" @ok="handleAddAssetModalOk">

            <b-form @submit.stop.prevent="">

                <b-form-group label="Titel" label-for="title">
                    <b-form-input id="title" v-model="asset.title" type="text" required />
                </b-form-group>

                <b-form-group label="Beschreibung" label-for="description">
                    <b-form-textarea id="description" v-model="asset.description" />
                </b-form-group>

                <b-form-group label="Inhalt" label-for="content">
                    <editor-content :editor="editor" />
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
        ...mapActions('marker', ['addAsset']),
        ...mapActions('assets', ['updateAsset']),

        handleUpdateAssetModal: function (id) {

            this.asset = Object.assign({}, this.getAsset(id)); 

            this.$bvModal.show('modal-update-asset')
        },

        handleUpdateAssetModalOk: function (e) {
            e.preventDefault();
            this.handleUpdateAssetSubmit()
        },

        handleAddAssetModalOk: function (e) {
            e.preventDefault();
            this.handleAddAssetSubmit()
        },

        handleUpdateAssetSubmit: function () {

            this.updateAsset(this.asset)
                .then(() => {
                    this.asset = {}
                    this.$bvModal.hide('modal-update-asset')
                })

        },

        handleAddAssetSubmit: function () {

            this.asset.src = ''
            this.asset.type = 'PDF'

            this.addAsset(this.asset)

            this.asset = {}

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