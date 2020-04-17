<template>
    <vue-draggable-resizable 
        :resizable="false"
        :parent="true"
        :w="20"
        :h="30"
        :axis="'x'"
        :className="'c-marker'"
        :x="xPos"
        @dragstop="handleMarkerDragStop">
        <a href="#"
            @click.prevent="handleClickOnMarker()"
            :id="'popover-' + type + '-' + data.id" 
            :title="data.title" 
            :class="classNames">
            <b-icon-triangle-fill v-if="type=='upload'"></b-icon-triangle-fill>
            <b-icon-triangle v-if="type=='keyframe'"></b-icon-triangle>
        </a>
        <b-popover :target="'popover-' + type + '-' + data.id" triggers="hover" placement="bottom">
            <b-button-group>
                <b-button variant="light" size="sm">
                    {{data.title}}
                </b-button>
                <b-button variant="primary" size="sm" @click.prevent="openUpdateMarkerModal">
                    <b-icon-pencil></b-icon-pencil>
                </b-button>
                <b-button variant="light" size="sm" @click.prevent="handleDeleteMarkerAlert">
                    <b-icon-trash></b-icon-trash>
                </b-button>
            </b-button-group>
        </b-popover>

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
            return ['c-marker', 'c-marker--'+this.type]
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
        ...mapActions('marker', ['setMarker', 'updateMarker', 'setTmpMarker']),
        ...mapActions('arrangement', ['updateKeyframe', 'setTmpKeyframe']),

        setXPos: function () {
            const left = this.width / this.duration * this.data.time
            this.xPos = Math.round(left)
        },

        handleMarkerDragStop: function (left) {

            let time = left * (this.duration / this.width)
            time = Math.round(time)
            
            if (time != this.data.time) {
                this.data.time = time
                if (this.type == 'upload') {
                    this.updateMarker(this.data)
                        .then(()=>{
                            this.setXPos()
                        })
                } else if (this.type == 'keyframe') {
                     this.updateKeyframe(this.data)
                        .then(()=>{
                            this.setXPos()
                        })                   
                }
            }
        },

        handleClickOnMarker: function () {
            this.stopPlayer();
            this.setPosition(this.data.time)
            if (this.type == 'upload') {
                this.setMarker(this.data)
            }
        },

        openUpdateMarkerModal: function () {
            if (this.type == 'upload') {
                this.setTmpMarker(this.data)
            } else if (this.type == 'keyframe') {
                this.setTmpKeyframe(this.data)
            }
            this.$bvModal.show('modal-update-marker')
        },

        handleDeleteMarkerAlert: function () {

        }
    }
}
</script>

<style lang="scss" scoped>

.c-marker {
    display: inline-block;
    text-align: center;
    transform: translateX(-50%);
    transition: left 0.25s ease-out;

    &.dragging {
        opacity: 0.8;
    }

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