<template>
    <div>

        <b-modal id="modal-update-asset" size="lg" title="Update Asset" @ok="handleUpdateAssetModalOk">

            <b-form ref="formUpdateAsset" @submit.stop.prevent="handleUpdateAssetSubmit">

                <b-form-group label="Titel" label-for="title" 
                    :state="titleState" 
                    invalid-feedback="Name is required">
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

                <div v-if="tmpAsset.type=='IMAGE'||tmpAsset.type=='FILE'">

                    <b-form-file
                        v-model="tmpAsset.src"
                        :state="Boolean(tmpAsset.src)"
                        placeholder="Datei auswählen oder auf dieses Feld ziehen..."
                        drop-placeholder="Drop file here..."
                    ></b-form-file>

                </div>

                <div v-if="tmpAsset.type=='TEXT'">

                    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
                        <button :class="{ 'is-active': isActive.bold() }" @click="commands.bold">Bold</button>
                        <button :class="{ 'is-active': isActive.bold() }" @click="commands.bold">Bold</button>
                    </editor-menu-bar>

                    <editor-content :editor="editor" />

                </div>

            </b-form>

        </b-modal>

    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { Bold, Italic, Link, HardBreak, Heading } from 'tiptap-extensions'

export default {
    name: 'Asset',
    components: {
        EditorContent,
        EditorMenuBar
    },
    props: {
    },
    mounted: function () {
    },
    data: function () {
        return {
            titleState: null,
            editor: new Editor({
                extensions: [
                    new Bold(),
                    new Italic(),
                    new Link(),
                    new HardBreak(),
                    new Heading()
                ],
                content: this.tmpAsset ? this.tmpAsset.content : '',
            }),   
        }
    },
    beforeDestroy() {
        this.editor.destroy()
    },
    computed: {
        ...mapState('assets', ['tmpAsset', 'types', 'ranking']),
    },
    methods: {

        ...mapActions('assets', ['updateAsset','deleteAsset', 'setTmpAsset']),

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

            this.updateAsset(this.tmpAsset)
                .then(() => {
                    this.$bvModal.hide('modal-update-asset')
                })

        },

        // handleRemoveAsset: function () {
        //     this.$emit('remove', this.asset)
        // }

    }
    
}
</script>