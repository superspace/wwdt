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

                    <div class="marker__wrapper">

                        <div v-for="marker in markers" :key="marker.id">
                            <a href="#" variant="" :title="marker.title" :id="'marker-'+marker.id" v-on:click.prevent="handleClickOnMarker(marker)" :style="getMarkerStyle(marker.time)" class="marker"><b-icon-triangle-fill></b-icon-triangle-fill></a>
                            <b-tooltip :target="'marker-'+marker.id" variant="secondary" placement="bottom"></b-tooltip>
                        </div>

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

import { mapState, mapActions } from 'vuex'

import 'vue-slider-component/theme/default.css'

export default {
    name: 'Timeline',
    components: {
        VueSlider
    },
    data: function () {
        return {
            value: 0,
        }
    },
    created: function () {
        this.setStart(Date.now())
    },
    computed: {
        ...mapState('timeline', ['time','start','end','duration']),
        ...mapState('marker', ['markers']),

        formattime: function () {
            return this.$timestamp(this.start, this.time)
        }
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
        ...mapActions('player', ['stopPlayer', 'setPosition']),
        ...mapActions('marker', ['setActiveMarker']),

        onChange: function () {
            this.setPosition(this.value)
        },

        getMarkerStyle: function (time) {
            const left = 100 / this.duration * time;
            return {left: left + '%'}
        },

        handleClickOnMarker: function (marker) {
            this.value = marker.time
            this.stopPlayer();
            this.setPosition(marker.time)
            this.setActiveMarker(marker)
        },


    }
}
</script>

<style lang="scss">



.marker {
    transform: translateX(-50%);
    display: inline-block;
    text-align: center;
    position: absolute;

    &__wrapper {
        position: relative;
        width: 100%;
    }
}

.slider__tooltip {
    margin-bottom: 0;
    background: white;
    padding: 0 4px;
}

</style>