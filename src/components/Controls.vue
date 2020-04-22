<template>
    <vue-draggable-resizable 
        :resizable="false"
        :w="230"
        :h="70"
        :z="1000"
        :x="x"
        :y="y"
        class="c-controller">

        <div class="card">
            <div class="card-body d-flex justify-content-center">
                <div>

                    <b-button variant="primary" size="sm" v-show="!play" v-on:click="startPlayer">
                        <b-icon-play-fill></b-icon-play-fill>
                    </b-button>
                    <b-button variant="primary" size="sm" v-show="play" v-on:click="stopPlayer">
                        <b-icon-pause-fill></b-icon-pause-fill>
                    </b-button>

                    <b-button-group class="ml-2">   
                        <b-button variant="secondary" size="sm" v-on:click="stopPlayer(); setPosition(0)">
                            <b-icon-skip-start-fill></b-icon-skip-start-fill>
                        </b-button>
                        <b-button variant="secondary" size="sm" v-on:click="stopPlayer(); setPosition(0)">
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

import { mapState, mapActions } from 'vuex'

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
        ...mapState('timeline', ['time','start']),
    },
    methods: {
        ...mapActions('player', ['setPosition','setPlaybackRate','startPlayer','stopPlayer']),

    }
}
</script>

<style lang="scss">
.c-controller {
    background: white;
    border: none;
    box-shadow: 2px 2px 6px transparentize(black, 0.8);
    transform: translateX(-50%);
}

</style>