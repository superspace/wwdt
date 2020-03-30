<template>
    <vue-draggable-resizable 
        :resizable="false"
        :parent="true"
        :w="20"
        :h="30"
        :axis="'x'"
        :className="'marker--draggable'"
        :x="xPos"
        @dragstop="handleMarkerDragStop">
        <a href="#"
            @click.prevent="handleClickOnMarker()" 
            :title="marker.title" 
            :id="'marker-' + marker.id" 
            class="marker"><b-icon-triangle-fill></b-icon-triangle-fill>
        </a>
        <!-- :style="getMarkerStyle(marker.time)"  -->
        <!-- <b-tooltip :target="'marker-'+marker.id" variant="secondary" placement="bottom"></b-tooltip> -->
    </vue-draggable-resizable>

</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable'

import { mapState, mapActions } from 'vuex'

export default {
    name: 'TimelineMarker',
    components: {
        VueDraggableResizable
    },
    mounted: function () {
        let context = this
        setTimeout(function () {
            context.setXPos()
        }, 300)
    },
    data: function () {
        return {
            xPos: 0
        }
    },
    props: {
        marker: Object,
        parentWidth: Number
    },
    computed: {
        ...mapState('timeline', ['duration']),
    },
    watch: {
        parentWidth: function () {
            this.setXPos()
        }
    },
    methods: {

        ...mapActions('player', ['stopPlayer', 'setPosition']),
        ...mapActions('marker', ['setMarker', 'updateMarker']),

        setXPos: function () {
            const left = this.parentWidth / this.duration * this.marker.time
            this.xPos = Math.round(left)
        },

        handleMarkerDragStop: function (left) {

            let time = left * (this.duration / this.parentWidth)
            time = Math.round(time)
            
            if (time != this.marker.time) {
                this.marker.time = time
                this.updateMarker(this.marker)
                    .then(()=>{
                    })
            }
        },

        handleClickOnMarker: function () {
            this.stopPlayer();
            this.setPosition(this.marker.time)
            this.setMarker(this.marker)
        },
    }
}
</script>

<style lang="scss">
.marker {
    transform: translateX(-50%);
    display: inline-block;
    text-align: center;

    &__wrapper {
        position: relative;
        width: 100%;
    }
}
</style>