<template>
    <div class="card mb-2 pt-3">
        <div class="card-body">
            <div class="row">
                <div class="">
                    <pre>{{ start | moment("HH:mm:ss") }}</pre>
                </div>
                <div class="col">
                    <vue-slider
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

                    <div class="marker__wrapper" ref="markerParent">

                        <span v-if="duration > 0">
                            <timeline-marker v-for="marker in markers"
                                :key="marker.id"
                                :marker="marker"
                                :parentWidth="parentWidth"></timeline-marker>
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
            parentWidth: 0
        }
    },
    created: function () {
        this.setStart(Date.now())
    },
    mounted: function () {
        window.addEventListener('resize', this.setParentWidth)
        this.setParentWidth();
    },
    computed: {
        ...mapState('timeline', ['time','start','end','duration']),
        ...mapState('marker', ['markers']),

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
        },
        duration: function () {
            console.log(this.duration)
        }
    },
    methods: {
        ...mapActions('timeline', ['setStart']),
        ...mapActions('player', ['setPosition']),

        onTimelineChange: function () {
            this.setPosition(this.value)
        },

        setParentWidth: function () {
            if (this.$refs.markerParent)
                this.parentWidth = this.$refs.markerParent.clientWidth
        }

        // onMarkerChange: function () {

        // },

        // onDragMarkerStart: function () {
        //     console.log(this.$refs.markers.getIndex()); // eslint-disable-line no-console
        // }

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