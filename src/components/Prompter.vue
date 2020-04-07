<template>
    <b-alert variant="secondary" show class="text-center mt-3">
        <span style="white-space: pre;">{{ cue.text }}</span>
    </b-alert>
</template>

<script>

import vtt from 'vtt.js'

import { mapState } from 'vuex'

export default {
    name: 'Prompter',
    components: {

    },
    mounted: function () {

        if (this.recording.id) {

            this.file = process.env.VUE_APP_HOST + this.recording.transcript

            this.$http.get(this.file).then((response) => {
                this.parseVTT(response.data)
            })

        }
        
    },
    data: function () {
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