<template>
    <vue-draggable-resizable 
        :resizable="false"
        :h="70"
        :z="1000"
        :min-width="1"
        :x="x"
        :y="y"
        class="c-controls"
        v-if="active">

        <div class="card">
            <div class="card-body d-flex justify-content-center" style="white-space: nowrap;">

                <!-- <div v-if="sessionMode == 'MODE_RECORD'">

                    <b-button variant="primary" size="sm" v-b-tooltip title="Start" @click="startRecording" v-if="!isRecording">
                        <b-icon-clock-fill></b-icon-clock-fill>
                    </b-button>

                    <b-button variant="primary" size="sm" v-b-tooltip title="Stop" @click="stopRecording" v-if="isRecording">
                        <b-icon-stop-fill></b-icon-stop-fill>
                    </b-button>

                </div> -->

                <div v-if="sessionMode == 'MODE_EDIT'">

                    <b-button variant="primary" size="sm" v-show="!play" @click="startPlayer">
                        <b-icon-play-fill></b-icon-play-fill>
                    </b-button>
                    <b-button variant="primary" size="sm" v-show="play" @click="stopPlayer">
                        <b-icon-pause-fill></b-icon-pause-fill>
                    </b-button>

                    <b-button-group class="ml-2">   
                        <b-button variant="secondary" size="sm" @click="stopPlayer(); setPosition(0)">
                            <b-icon-skip-start-fill></b-icon-skip-start-fill>
                        </b-button>
                        <b-button variant="secondary" size="sm" @click="stopPlayer(); setPosition(0)">
                            <b-icon-skip-backward-fill></b-icon-skip-backward-fill>
                        </b-button>
                    </b-button-group>

                    <b-dropdown id="dropdown-1" :text="this.rate+'x'" size="sm" class="ml-md-2 mr-md-2">
                        <b-dropdown-item v-on:click="setPlaybackRate(0.5)">0.5x</b-dropdown-item>
                        <b-dropdown-item v-on:click="setPlaybackRate(1)">1x</b-dropdown-item>
                        <b-dropdown-item v-on:click="setPlaybackRate(2)">2x</b-dropdown-item>
                        <b-dropdown-item v-on:click="setPlaybackRate(5)">5x</b-dropdown-item>
                    </b-dropdown>

                </div>
            </div>

        </div>

    </vue-draggable-resizable>
</template>

<script>

import { mapState, mapActions, mapGetters } from 'vuex'

import VueDraggableResizable from 'vue-draggable-resizable'

export default {
    name: 'Controls',
    components: {
        VueDraggableResizable
    },
    data: function () {
        return {
            marker: {},
            x: 0,
            y: 5
        }
    },
    created: function () {
        this.x = window.innerWidth / 2
    },
    computed: {
        ...mapState('player', ['play','rate']),
        ...mapState('timeline', ['time', 'start', 'isRecording']),
        ...mapGetters('project', ['sessionMode']),

        active: function () {
            return this.sessionMode == 'MODE_EDIT'
        }
    },
    methods: {
        ...mapActions('player', ['setPosition','setPlaybackRate','startPlayer','stopPlayer']),
        ...mapActions('project', ['setSessionStart','setSessionEnd']),

        startRecording: function () {
            let start = this.$moment().format('YYYY-MM-DD HH:mm:ss')
            this.setSessionStart(start)
        },

        stopRecording: function () {
            let end = this.$moment().format('YYYY-MM-DD HH:mm:ss')
            this.setSessionEnd(end)
        }


    }
}
</script>

<style lang="scss">
.c-controls {
    background: white;
    border: none;
    box-shadow: 2px 2px 6px transparentize(black, 0.8);
    transform: translateX(-50%);
}

</style>