<template>
    <vue-audio :file="src"></vue-audio>
</template>

<script>
import VueAudio from 'vue-audio'

export default {
    name: 'AudioPlayer',
    components: {
        VueAudio
    },
    props: {
        src:String
    }
}
</script>