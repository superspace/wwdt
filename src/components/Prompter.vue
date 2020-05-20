<template>
    <b-alert variant="primary" show class="c-prompter text-center mt-3 p-4">
        <em style="white-space: pre;">{{ cue.text }}</em>
    </b-alert>
</template>

<script>

import vtt from 'vtt.js'

import { mapState, mapGetters } from 'vuex'

export default {
    name: 'Prompter',
    components: {

    },
    mounted: function () {

        if (!this.active) {
            return
        }

        this.file = process.env.VUE_APP_ADMIN_HOST + this.recording.transcript

        this.$http.get(this.file).then((response) => {
            this.parseVTT(response.data)
        })

        
    },
    data: () => {
        return {
            parser: null,
            file: '',
            cues: [],
            cue: {}
        }
    },
    computed: {
        ...mapState('timeline', ['time']),
        ...mapState('project', ['recording']),

        ...mapGetters('project', ['sessionMode']),

    },
    watch: {
        time: function (val) {

            function checkCue (cue) {
                return val >= cue.startTime && val <= cue.endTime
            }

            const filtered = this.cues.filter(checkCue)
            if (filtered.length) {
                this.cue = filtered[0]
            } else {
                this.cue = {}
            }

        }
    },
    methods: {
        parseVTT:  function (data) {

            const WebVTT = vtt.WebVTT
            const context = this;

            this.parser = new WebVTT.Parser(window, WebVTT.StringDecoder());

            this.parser.oncue = function(cue) {

                context.cues.push(
                    {
                        text: cue.text,
                        startTime: cue.startTime,
                        endTime: cue.endTime
                    }
                );
            };

            this.parser.parse(data);
            this.parser.flush();

        }
    }
}
</script>

<style lang="scss">

.c-prompter {
    min-height: 100px;
}
</style>