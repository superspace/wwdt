<template>
    <div>
        <b-alert variant="danger" :show="deleteMarkerAlert" class="d-flex flex-row justify-content-between">
            <span><b-icon-trash></b-icon-trash> Delete marker <strong>{{ tmpMarker.title }}</strong> ?</span>
            <b-button-group>
                <b-button variant="danger" size="sm" @click="handleDeleteMarker">Yes</b-button>
                <b-button variant="" size="sm" @click="handleCancelDeleteMarker">No</b-button>
            </b-button-group>
        </b-alert>

        <b-modal id="modal-update-marker" size="md" title="Update Marker" @ok="handleUpdateMarkerModalOK">

            <b-form ref="formUpdateAsset" @submit.stop.prevent="handleUpdateMarkerSubmit">

                <b-form-group label="Title" label-for="title" 
                    invalid-feedback="Title is required">
                    <b-form-input id="title" v-model="tmpMarker.title" type="text" required />
                </b-form-group>

                <b-form-group label="Time" label-for="time" 
                    invalid-feedback="Time is required">
                    
                    <b-input-group>
                        <b-form-spinbutton id="time" v-model="tmpMarker.time" step="1" min="0" :max="duration" required />
                        <b-input-group-append>
                            <b-alert class="p-2" variant="secondary" show><pre class="mb-0"> <b-icon-clock></b-icon-clock> {{ $timestamp(start, tmpMarker.time) }}</pre></b-alert>
                        </b-input-group-append>
                    </b-input-group>

                </b-form-group>

            </b-form>

        </b-modal>

        <b-modal id="modal-create-marker" title="Add Marker" @ok="handleCreateMarkerModalOK">

            <b-form @submit.stop.prevent="handleCreateMarkerSubmit">

                <b-alert class="p-2 text-center" variant="secondary" show>
                    <pre class="mb-0"> <b-icon-clock></b-icon-clock> {{ $timestamp(start, time) }}</pre>
                </b-alert>

                <b-form-group label="Title" label-for="title" 
                    invalid-feedback="Title is required">
                    <b-form-input id="title" v-model="tmpMarker.title" type="text" required />
                </b-form-group>

            </b-form>

        </b-modal>

    </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
    name: 'MarkerEditor',
    components: {
    },
    data: function () {
        return {
        }
    },
    mounted: function () {
    },
    computed: {
        ...mapState('marker', ['tmpMarker','deleteMarkerAlert']),
        ...mapState('timeline', ['start','duration','time'])
    },
    watch: {
    },
    methods: {
        ...mapActions('marker', [
                'createMarker',
                'updateMarker',
                'deleteMarker',
                'setTmpMarker',
                'setDeleteMarkerAlert'
            ]),

        // Create Marker

        handleCreateMarkerModalOK: function (e) {
            e.preventDefault();
            this.handleCreateMarkerSubmit()
        },

        handleCreateMarkerSubmit: function () {

            this.tmpMarker.time = this.time

            this.createMarker(this.tmpMarker)
                .then(() => {
                    this.setTmpMarker()
                    this.$bvModal.hide('modal-create-marker')
                })

        },

        // Update Marker

        handleUpdateMarkerModalOK: function (e) {
            e.preventDefault();
            this.handleUpdateMarkerSubmit()
        },

        handleUpdateMarkerSubmit: function () {
            this.updateMarker(this.tmpMarker)
                .then(() => {
                    this.setTmpMarker({})
                    this.$bvModal.hide('modal-update-marker')
                })   
        },

        // Delete Marker

        handleCancelDeleteMarker: function () {
            this.setTmpMarker({})
            this.setDeleteMarkerAlert(false)
        },

        handleDeleteMarker: function () {
            const data = {
                id: this.tmpMarker.id
            }

            this.deleteMarker(data)
                .then(() => {
                    this.setTmpMarker({})
                    this.setDeleteMarkerAlert(false)
                })   

        },



    }
}
</script>