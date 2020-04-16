<template>
    <vue-draggable-resizable 
        :resizable="false"
        :parent="true"
        :w="20"
        :h="30"
        :axis="'x'"
        :className="'marker'"
        :x="xPos"
        @dragstop="handleMarkerDragStop">
        <a href="#" v-b-tooltip.hover.bottom
            @click.prevent="handleClickOnMarker()" 
            :title="data.title" 
            :class="classNames"><b-icon-triangle-fill></b-icon-triangle-fill>
        </a>
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
        this.setXPos()
    },
    data: function () {
        return {
            xPos: 0
        }
    },
    props: {
        data: Object,
        width: Number,
        type: {
            type: String,
            default: 'upload'
        }
    },
    computed: {
        ...mapState('timeline', ['duration']),

        classNames: function () {
            return ['marker', 'marker--'+this.type]
        }
    },
    watch: {
        data: function () {
            this.setXPos()
        },
        width: function () {
            this.setXPos()
        }
    },
    methods: {

        ...mapActions('player', ['stopPlayer', 'setPosition']),
        ...mapActions('marker', ['setMarker', 'updateMarker']),

        setXPos: function () {
            const left = this.width / this.duration * this.data.time
            this.xPos = Math.round(left)
        },

        handleMarkerDragStop: function (left) {

            let time = left * (this.duration / this.width)
            time = Math.round(time)
            
            if (time != this.data.time) {
                this.data.time = time
                this.updateMarker(this.data)
                    .then(()=>{
                        this.setXPos()
                    })
            }
        },

        handleClickOnMarker: function () {
            this.stopPlayer();
            this.setPosition(this.data.time)
            this.setMarker(this.data)
        },
    }
}
</script>

<style lang="scss" scoped>

.marker {
    transform: translateX(-50%);
    display: inline-block;
    text-align: center;

    transition: left 0.25s ease-out;

    &--upload {
        color: var(--primary);
    }

    &--keyframe {
        color: var(--secondary);
    }

    &__wrapper {
        position: relative;
        width: 100%;
    }
}
</style>