<template>
    <div class="card mb-2">
        <div class="card-body">
            <div class="row">
                <div class="">
                    <pre>{{ start | moment("HH:mm:ss") }}</pre>
                </div>
                <div class="col">
                    <vue-slider
                        v-model="value"
                        v-on:change="onChange"
                        :min="0"
                        :max="duration"
                        :interval="0.1"
                        :tooltip="'always'">

                        <template v-slot:tooltip="{ value, focus }">
                            <pre :class="['slider__tooltip', { focus }]">{{ formattime }}</pre>
                        </template>

                    </vue-slider>

                    <div class="marker__wrapper" ref="markerParent">

                        <timeline-marker v-for="marker in markers" 
                            :key="marker.index"
                            :marker="marker"
                            :parentWidth="parentWidth"></timeline-marker>

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

        let context = this;

        window.addEventListener('resize', function () {
            context.parentWidth = context.$refs.markerParent.clientWidth
        })

        this.parentWidth = this.$refs.markerParent.clientWidth
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
        }
    },
    methods: {
        ...mapActions('timeline', ['setStart']),
        ...mapActions('player', ['setPosition']),

        onChange: function () {
            this.setPosition(this.value)
        },
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
    width: 100%;
    position: relative;
}

</style>