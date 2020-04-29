<template>
    <div class="card mb-3">
        <video ref="videoPlayer" class="video-js c-video-player">
        </video>
    </div>    
</template>

<script>
import videojs from 'video.js';

import { mapState, mapActions } from 'vuex'

export default {
    name: 'VideoPlayer',
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
            muted: true
        }
    },
    mounted: function () {
        const context = this

        if (this.recording && this.recording.id) {
            this.options['sources'] = [					{
                    src: process.env.VUE_APP_HOST + this.recording.file_path,
                    type: this.recording.type
                }
            ]        
        }

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
        ...mapState('project', ['recording'])
    },
    methods: {
        ...mapActions('timeline', ['setDuration', 'setTime']),
        ...mapActions('player', ['stopPlayer'])
    },
    watch: {
        position: function (val) {

            this.player.currentTime(val)
        },
        rate: function (val) {
            this.player.playbackRate(val)
        },
        volume: function (val) {
            this.player.setVolume(val)  
        },
        muted: function (val) {
            this.player.muted(val)
        },
        play: function (val) {
            if (val === true) {
                this.player.play();
            } else {
                this.player.pause();
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