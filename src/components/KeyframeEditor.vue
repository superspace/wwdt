<template>
    <div>
        <b-alert variant="danger" :show="deleteKeyframeAlert" class="d-flex flex-row justify-content-between">
            <span><b-icon-trash></b-icon-trash> Delete keyframe <strong>{{ tmpKeyframe.title }}</strong> ?</span>
            <b-button-group>
                <b-button variant="danger" size="sm" @click="handleDeleteKeyframe">Yes</b-button>
                <b-button variant="" size="sm" @click="handleCancelDeleteKeyframe">No</b-button>
            </b-button-group>
        </b-alert>

        <b-modal id="modal-update-keyframe" size="md" title="Update Keyframe" @ok="handleUpdateKeyframeModalOK">

            <b-form @submit.stop.prevent="handleUpdateKeyframeSubmit">

                <b-form-group label="Title" label-for="title" 
                    invalid-feedback="Title is required">
                    <b-form-input id="title" v-model="tmpKeyframe.title" type="text" required />
                </b-form-group>

                <b-form-group label="Time" label-for="time" 
                    invalid-feedback="Time is required">
                    
                    <b-input-group>
                        <b-form-spinbutton id="time" v-model="tmpKeyframe.time" step="1" min="0" :max="duration" required />
                        <b-input-group-append>
                            <b-alert class="p-2" variant="secondary" show><pre class="mb-0"> <b-icon-clock></b-icon-clock> {{ $timestamp(start, tmpKeyframe.time) }}</pre></b-alert>
                        </b-input-group-append>
                    </b-input-group>

                </b-form-group>

            </b-form>

        </b-modal>

        <b-modal id="modal-create-keyframe" title="Add Keyframe" @ok="handleCreateKeyframeModalOK">

            <b-form @submit.stop.prevent="handleCreateKeyframeSubmit">

                <b-alert class="p-2 text-center" variant="secondary" show>
                    <pre class="mb-0"> <b-icon-clock></b-icon-clock> {{ $timestamp(start, time) }}</pre>
                </b-alert>

                <b-form-group label="Title" label-for="title" 
                    invalid-feedback="Title is required">
                    <b-form-input id="title" v-model="tmpKeyframe.title" type="text" required />
                </b-form-group>

            </b-form>

        </b-modal>

    </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
    name: 'KeyframeEditor',
    components: {
    },
    data: function () {
        return {
        }
    },
    mounted: function () {
    },
    computed: {
        ...mapState('keyframe', ['tmpKeyframe','deleteKeyframeAlert']),
        ...mapState('timeline', ['time','start','duration']),

    },
    watch: {
    },
    methods: {
        ...mapActions('keyframe', [
            'createKeyframe',
            'updateKeyframe',
            'deleteKeyframe',
            'setTmpKeyframe', 
            'setDeleteKeyframeAlert'
        ]),

        // Create Keyframe

        handleCreateKeyframeModalOK: function (e) {
            e.preventDefault();
            this.handleCreateKeyframeSubmit()
        },

        handleCreateKeyframeSubmit: function () {

            this.tmpKeyframe.time = this.time

            this.createKeyframe(this.tmpKeyframe)
                .then(() => {
                    this.setTmpKeyframe()
                    this.$bvModal.hide('modal-create-keyframe')
                })

        },

        // Update Keyframe

        handleUpdateKeyframeModalOK: function (e) {
            e.preventDefault();
            this.handleUpdateKeyframeSubmit()

        },

        handleUpdateKeyframeSubmit: function () {
            this.updateKeyframe(this.tmpKeyframe)
                .then(() => {
                    this.setTmpKeyframe({})
                    this.$bvModal.hide('modal-update-keyframe')
                })   
        },

        // Delete Keyframe

        handleDeleteKeyframe: function () {
            const data = {
                id: this.tmpKeyframe.id
            }

            this.deleteKeyframe(data)
                .then(() => {
                    this.setDeleteKeyframeAlert(false)
                })   
        },

        handleCancelDeleteKeyframe: function () {
            this.setTmpKeyframe({})
            this.setDeleteKeyframeAlert(false)
        }


    }
}
</script>