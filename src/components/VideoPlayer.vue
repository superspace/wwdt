<template>
    <div v-if="active">
        <div class="mb-3" >
            <video ref="videoPlayer" class="video-js c-video-player"></video>
        </div>    
        <prompter v-show="showPrompter"></prompter>
        <div class="d-flex justify-content-between align-items-center">
            <div></div>
            <b-button-group class="mb-3">
                <b-button size="sm" class="ml-2" @click="handleMuteToggleClick">
                    <b-icon-volume-mute-fill v-if="muted"></b-icon-volume-mute-fill>
                    <b-icon-volume-up-fill v-if="!muted"></b-icon-volume-up-fill>
                </b-button>
                <b-button size="sm" class="ml-2" @click="handlePrompterToggleClick">
                    <b-icon-chat-square-dots v-if="!showPrompter"></b-icon-chat-square-dots>
                    <b-icon-chat-square-dots-fill v-if="showPrompter"></b-icon-chat-square-dots-fill>
                </b-button>
            </b-button-group>
        </div>
    </div>
</template>

<script>
import videojs from 'video.js';

import Prompter from "@/components/Prompter";

import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    name: 'VideoPlayer',
    components: {
        Prompter,
    },
    props: {
    },
    data: function () {
        return {
            player: null,
            options: {
                fluid: true,
                autoplay: false,
                controls: false,
                muted: true
            },
            volume: 0.5,
            muted: true,
            showPrompter: false
        }
    },
    mounted: function () {

        if (!this.active) {
            return
        }
        const context = this

        this.options['sources'] = [					{
                src: process.env.VUE_APP_ADMIN_HOST + this.recording.file_path,
                type: this.recording.type
            }
        ]        
        this.player = videojs(this.$refs.videoPlayer, this.options)

        this.player.on('loadedmetadata', function () {
            let duration = this.duration();
            duration = Math.round(duration);
            context.setDuration(duration);
        })
        this.player.on('timeupdate', function () {
            const time = Math.round(this.currentTime()*100)/100
            context.setTime(time)
        })
        this.player.on('ended', function () {
            context.stopPlayer()
        })


    },
    beforeDestroy() {
        if (this.player) {
            this.player.dispose()
        }
    },
    computed: {
        ...mapState('timeline', ['time']),
        ...mapState('player', ['play','position', 'rate']),
        ...mapState('project', ['recording']),

        ...mapGetters('project', ['sessionMode']),

        active: function () {
            return this.sessionMode == 'MODE_EDIT' ? true : false
        }
    },
    methods: {
        ...mapActions('timeline', ['setDuration', 'setTime']),
        ...mapActions('player', ['stopPlayer']),

        handleMuteToggleClick: function () {
            this.muted = !this.muted
        },

        handlePrompterToggleClick: function () {
            this.showPrompter = !this.showPrompter
        }

    },
    watch: {
        position: function (val) {
            if (this.player)
                this.player.currentTime(val)
        },
        rate: function (val) {
            if (this.player)
                this.player.playbackRate(val)
        },
        volume: function (val) {
            if (this.player)
                this.player.setVolume(val)  
        },
        muted: function (val) {
            if (this.player)
                this.player.muted(val)
        },
        play: function (val) {
            if (this.player) {
                if (val === true) {
                    this.player.play();
                } else {
                    this.player.pause();
                }
            }
        }
    }
}
</script>

<style lang="scss">
.c {
    &-video-player {
        width: 100%;
    }
}
</style>