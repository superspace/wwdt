<template>
    <div class="card mb-2 pt-3">
        <div class="card-body">
            <div class="row">
                <div class="">
                    <pre>{{ start | moment("HH:mm:ss") }}</pre>
                </div>
                <div class="col">
                    <vue-slider
                        ref="slider"
                        v-model="value"
                        @change="onTimelineChange"
                        :min="0"
                        :max="duration"
                        :interval="0.1"
                        :tooltip="'always'">

                        <template v-slot:tooltip="{ value, focus }">
                            <pre :class="['slider__tooltip', { focus }]">{{ formattime }}</pre>
                        </template>

                    </vue-slider>

                    <div class="marker__wrapper">

                        <span v-if="duration > 0">
                            <timeline-marker v-for="item in markers"
                                :key="item.id"
                                :data="item"
                                :width="width"></timeline-marker>
                        </span>
                    </div>

                    <div class="marker__wrapper">

                        <span v-if="duration > 0">
                            <timeline-marker v-for="item in keyframes"
                                :key="item.id"
                                :data="item"
                                :type="'keyframe'"
                                :width="width"></timeline-marker>
                        </span>
                    </div>

                </div>
                <div>
                    <pre>{{ end | moment("HH:mm:ss") }}</pre>
                </div>
            </div>
        </div>    

    </div>    
</template>

<script>

import VueSlider from 'vue-slider-component'
import TimelineMarker from './TimelineMarker'

import { mapState, mapActions } from 'vuex'

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
            width: 0
        }
    },
    created: function () {
        this.setStart(Date.now())
    },
    mounted: function () {
        window.addEventListener('resize', this.setWidth)
        let context = this;
        setTimeout(function () {
            context.setWidth();
        }, 300)
    },
    computed: {
        ...mapState('timeline', ['time','start','end','duration']),
        ...mapState('marker', ['markers']),
        ...mapState('arrangement', ['keyframes']),

        formattime: function () {
            return this.$timestamp(this.start, this.time)
        },
    },
    watch: {
        time: function (val) {
            if (val <= this.duration) {
                this.value = val
            } else {
                this.value = this.duration
            }
        }
    },
    methods: {
        ...mapActions('timeline', ['setStart']),
        ...mapActions('player', ['setPosition']),

        onTimelineChange: function () {
            this.setPosition(this.value)
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

.marker__wrapper {
    width: auto;
    position: relative;
}

</style>