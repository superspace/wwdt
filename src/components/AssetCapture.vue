<template>
    <div>
        <b-overlay :show="inProgress">
            <div class="text-center">

                <pre class="mb-4"><b-icon-clock></b-icon-clock> {{ now | moment("HH:mm:ss") }} Uhr</pre>

                <div v-if="!filename">
                    <b-form-file 
                        class="mb-4"
                        :placeholder="'Add Asset'"
                        @input="handleFilePreview()"
                        v-model="tmpAsset.upload">
                    </b-form-file>
                </div>

                <b-form ref="formCreateAsset" v-if="filename">

                    <div class="mb-4" v-if="preview">
                        <img :src="preview" class="img-fluid" />
                    </div>

                    <b-form-group label-for="title" :state="titleState"
                        invalid-feedback="Title is required">

                        <b-form-input id="title" placeholder="Title" v-model="tmpAsset.title" type="text" required />

                    </b-form-group>

                    <b-form-group>
                        <b-form-textarea placeholder="Description" v-model="tmpAsset.description" />
                    </b-form-group>

                    <b-button block variant="primary"
                        @click.prevent="handleCreateAssetSubmit">
                        <b-icon-cloud-upload></b-icon-cloud-upload> Save
                    </b-button>

                    <b-button block variant="secondary"
                        @click.prevent="reset">
                        Cancel
                    </b-button>
                </b-form>
            </div>
        </b-overlay>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
    name: "AssetCapture",
    data: () => {
        return {
            preview: "",
            filename: "",
            inProgress: false,
            titleState: true
        };
    },
    created: function() {
        this.setTmpAsset()
    },
    watch: {
        // 'tmpAsset.upload': function () {
        //     this.filename = ''
        //     this.preview = ''
        // }
    },
    computed: {
        ...mapState("assets", ["tmpAsset", "types", "ranking"]),
        ...mapState("marker", ["marker"]),
        ...mapState("timeline", ["start", 'time', 'now']),

    },
    methods: {
        ...mapActions("assets", ["createAsset","setTmpAsset"]),
        ...mapActions("marker", ["createMarker"]),

        reset: function () {
            this.inProgress = false
            this.titleState = true
            this.preview = ''
            this.filename = ''
            this.setTmpAsset()
        },

        checkCreateAssetValidity: function () {
            const valid = this.$refs.formCreateAsset.checkValidity()
            this.titleState = valid
            return valid
        },

        handleCreateAssetSubmit: function () {

            if (!this.checkCreateAssetValidity()) {
                return
            }

            this.inProgress = true

            let marker = {
                title: 'MARKER',
                time: this.time
            }

            this.createMarker(marker)
                .then(() => {

                    const payload = {
                        asset: this.tmpAsset,
                        marker: this.marker
                    }

                    this.createAsset(payload)
                        .then(() => {
                            this.reset()
                        })
                })

        },

        handleFilePreview: function() {

            let reader = new FileReader();
            reader.addEventListener(
                "load",
                function () {
                    this.preview = reader.result
                }.bind(this),
                false
            );

            if (this.tmpAsset.upload) {
                this.filename = this.tmpAsset.upload.name
                this.tmpAsset.title = this.filename
                let extension = this.filename.split('.').pop().toLowerCase()

                const index = this.types.findIndex(x => x.types.includes(extension))
                this.tmpAsset.type = index !== -1 ? this.types[index].value : 'FILE' 

                if (this.tmpAsset.type === 'IMAGE') {
                    reader.readAsDataURL(this.tmpAsset.upload)
                }
            }

        }
    }
};
</script>

<style lang="scss">

.custom-file-label {

    background-color: var(--primary) !important;
    border: none !important;
    color: #FFF !important;

    &:after {
        display: none !important;
    }
}

</style>