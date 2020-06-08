<template>
    <div class="card mb-2 pt-3">
        <div class="card-body">
            <div class="row">
                <div>
                    <pre v-if="start > 0">{{ start | moment("HH:mm:ss") }}</pre>
                </div>
                <div class="col">
                    <vue-slider
                        ref="slider"
                        v-model="value"
                        @change="onTimelineChange"
                        :lazy="true"
                        :min="0"
                        :adsorb="true"
                        :max="duration"
                        :interval="0.1"
                        :silent="true"
                        :clickable="sessionMode == 'MODE_EDIT'"
                        :process-style="{ backgroundColor: 'var(--primary)' }"
                        :tooltip="'always'">

                        <template v-slot:tooltip="{ value, focus }">
                            <pre :class="['slider__tooltip', { focus }]">{{ formattime }}</pre>
                        </template>

                    </vue-slider>

                    <div class="c-timeline-marker">

                        <span v-if="duration > 0">
                            <timeline-marker v-for="item in markers"
                                :key="item.id"
                                :data="item"
                                :width="width"></timeline-marker>
                        </span>
                    </div>

                    <div class="c-timeline-marker" v-if="hasEditPermission">

                        <span v-if="duration > 0">
                            <timeline-marker v-for="item in keyframes"
                                :key="item.id"
                                :data="item"
                                :type="'keyframe'"
                                :width="width"></timeline-marker>
                        </span>
                    </div>

                </div>
                <div v-if="sessionMode == 'MODE_EDIT'">
                    <pre>{{ end | moment("HH:mm:ss") }}</pre>
                </div>
            </div>
        </div>    

    </div>    
</template>

<script>

import VueSlider from 'vue-slider-component'
import TimelineMarker from './TimelineMarker'

import { mapState, mapActions, mapGetters } from 'vuex'

import 'vue-slider-component/theme/default.css'

export default {
    name: 'Timeline',
    components: {
        VueSlider,
        TimelineMarker
    },
    data: function () {
        return {
            value: 0,
            width: 0,
            dataInterval: null
        }
    },
    created: function () {

        if (this.session.start) {
            this.setStart(this.session.start)
        }

        if (this.sessionMode == 'MODE_RECORD') {

            if (this.session.end > Date.now()) {
                this.startRecording()
            } else {
                const duration = Math.round((this.session.end - this.session.start)/1000*10)/10
                this.setDuration(duration)
                this.value = this.duration
                this.setTime(this.duration)
            }
        }

    },
    destroyed: function () {
        this.stopRecording()
    },
    mounted: function () {
        window.addEventListener('resize', this.setWidth)
        let context = this;
        setTimeout(function () {
            context.setWidth();
        }, 500)

    },
    computed: {
        ...mapState('timeline', ['time','start','end','duration', 'isRecording', 'now']),
        ...mapState('marker', ['markers']),
        ...mapState('keyframe', ['keyframes']),
        ...mapState('project', ['recording', 'session', 'MODE_EDIT', 'MODE_RECORD']),
        ...mapState('arrangement', {arrangement:'arrangement', arrangementLocked:'locked'}),

        ...mapGetters('project', ['sessionMode']),
        ...mapGetters('user', ['hasEditPermission']),

        formattime: function () {
            return this.start > 0 ? this.$timestamp(this.start, this.time) : ''
        },
    },
    watch: {
        now: function (val) {

            if (this.isRecording) {
                let duration = Math.round((val - this.start)/1000*10)/10
                this.setDuration(duration)
                this.setTime(duration)
            }
        },

        isRecording: function (val) {

            if (this.sessionMode == 'MODE_RECORD') {

                if (val == true) {
                    this.startRecording()
                } else {
                    this.stopRecording()
                }
            }

        },

        time: function (val) {

            if (val < this.duration) {
                this.value = val
            } else {
                this.value = this.duration
            }

            let context = this

            if (this.sessionMode == this.MODE_EDIT) {
                const markers = this.markers
                    .filter(marker => marker.time == Math.round(context.time))

                if (markers.length) {
                    const marker = markers.slice(-1)[0]
                    this.setMarker(marker)
                } else {
                    this.setMarker()
                }
            }

            if (this.sessionMode == this.MODE_EDIT || (this.sessionMode == this.MODE_RECORD && !this.hasEditPermission)) {

                let context = this

                const keyframes = this.keyframes
                    .filter(keyframe => keyframe.time <= context.time)

                if (keyframes.length) {
                    const keyframe = keyframes.slice(-1)[0]
                    this.setKeyframe(keyframe)
                } else {
                    this.setKeyframe()
                }
            }

        }
    },
    methods: {
        ...mapActions('timeline', ['setDuration', 'setTime', 'setStart', 'startTimer']),
        ...mapActions('player', ['setPosition']),
        ...mapActions('keyframe', ['setKeyframe']),
        ...mapActions('marker', ['setMarker','getMarkers']),
        ...mapActions('arrangement', ['getArrangement']),

        ...mapActions('assets', ['getAssets']),

        onTimelineChange: function () {
            this.setPosition(this.value)
        },

        startRecording: function () {

            this.startTimer()

            if (!this.dataInterval) {


                let context = this;
                this.dataInterval = setInterval(function () {
                    context.getAssets()
                        .then(()=>{
                            context.getMarkers()
                            if (!context.arrangementLocked) {
                                context.getArrangement(context.arrangement.id)
                            }
                        })
                }, 5000)
            }

        },

        stopRecording: function () {
            if (this.dataInterval)
                clearInterval(this.dataInterval)
        },

        setWidth: function () {
            if (this.$refs.slider) {
                this.width = this.$refs.slider.$el.offsetWidth
            }
        }

    }
}
</script>

<style lang="scss">

.slider__tooltip {
    margin-bottom: 0;
    background: white;
    padding: 0 4px;
}

.c-timeline-marker {
    width: auto;
    position: relative;
    height: 20px;
    overflow: hidden;
}

</style>