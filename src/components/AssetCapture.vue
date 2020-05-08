<template>
    <div>
        <div class="text-center">

            <pre class="mb-4"><b-icon-clock></b-icon-clock> {{ now | moment("HH:mm:ss") }} Uhr</pre>

            <div v-if="!preview">
                <b-form-file 
                    class="mb-4"
                    @input="handleFilePreview()"
                    v-model="tmpAsset.upload"></b-form-file>
            </div>

            <div v-if="1">
                <div class="mb-4">
                        <img :src="preview" class="img-fluid" />
                </div>
                <b-form-group>
                    <b-form-input type="text" placeholder="Title" v-model="tmpAsset.title" />
                </b-form-group>
                <b-form-group>
                    <b-form-textarea placeholder="Description" v-model="tmpAsset.description" />
                </b-form-group>

                <b-button block variant="primary"
                    @click.prevent="handleCreateAssetSubmit">
                    <b-icon-plus></b-icon-plus> Add Asset
                </b-button>
            </div>
        </div>
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
        };
    },
    created: function() {
        this.setTmpAsset()
    },
    watch: {
        'tmpAsset.upload': function () {
            this.filename = ''
            this.preview = ''
        }
    },
    computed: {
        ...mapState("assets", ["tmpAsset", "types", "ranking"]),
        ...mapState("marker", ["marker"]),
        ...mapState("timeline", ["start", 'time', 'now']),

    },
    methods: {
        ...mapActions("assets", ["createAsset","setTmpAsset"]),
        ...mapActions("marker", ["createMarker"]),

        handleCreateAssetSubmit: function () {

            let marker = {
                title: 'Marker ' + this.time, 
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
                            this.setTmpAsset()
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

<style lang="scss" scoped>
.custom-file-label {
    &:after {
        display: none !important;
    }
}
</style>