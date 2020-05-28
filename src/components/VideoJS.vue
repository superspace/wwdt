<template>
    <video ref="videoPlayer" class="video-js c-video-player"></video>
</template>

<script>
import videojs from 'video.js';

export default {
    name: 'VideoJS',
    data: function () {
        return {
            player: null,
            options: {
                fluid: true,
                autoplay: false,
                controls: true,
                muted: false
            },
        }
    },
    props: {
        src: String,
        type: String,
        volume: Number,
        muted: Boolean
    },
    mounted: function () {
        this.options['sources'] = [{
                src: this.src,
                type: this.type
        }]
        this.player = videojs(this.$refs.videoPlayer, this.options)
    },
    beforeDestroy() {
        if (this.player) {
            this.player.dispose()
        }
    },
}
</script>