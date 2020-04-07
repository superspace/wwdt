<template>
    <vue-draggable-resizable ref="draggable"
        :parent="true"
        :w="w"
        :h="h"
        :x="x"
        :y="y"
        :z="z"
        :min-width="200"
        :min-height="40"
        :class="assetClass"
        :handles="['tl','tr','br','bl']"
        :resizable="isResizable"
        @dragging="handleDragging"
        @dragstop="handleDragStop"
        @resizing="handleResize"
        @resizestop="handleResizeStop"
        @activated="handleActivation"
        @deactivated="handleDeactivation"
        v-show="visible">

        <div v-show="active">
            <div class="c-asset__header d-flex flex-row align-end">
                <!-- <span>{{ asset.data.title }}</span> -->
                <span>
                    <b-button-group>
                        <b-button size="sm" variant="primary">
                            <b-icon-pencil></b-icon-pencil>
                        </b-button>
                        <b-button size="sm" variant="light">
                            <b-icon-arrow-up-short @click.prevent="handleUpZ"></b-icon-arrow-up-short>
                        </b-button>
                        <b-button size="sm" variant="light" @click.prevent="handleDownZ">
                            <b-icon-arrow-down-short></b-icon-arrow-down-short>
                        </b-button>
                        <b-button size="sm" variant="light">
                            <b-icon-trash></b-icon-trash>
                        </b-button>
                    </b-button-group>
                </span> 
            </div>
        </div>

        <h2 :class="['mb-0', textClass]" v-if="asset.data.type == 'LABEL'">{{ asset.data.title }}</h2>

        <figure v-show="asset.data.file" >
            <img @load="handleLoad" :src="src" :alt="asset.data.title" class="img-fluid" ref="image" /> 
        </figure>

    </vue-draggable-resizable>
</template>

<script>

import VueDraggableResizable from 'vue-draggable-resizable'

import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

import { mapState } from 'vuex'

export default {
    name: 'DraggableAsset',
    components: {
        VueDraggableResizable
    },
    props: {
        asset: {}
    },
    data: function () {
        return {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            z: 1,
            w: 200,
            h: 40,
            scale: 1,
            ratio: 0,
            dragging: false,
            resize: false,
            visible: false,
            active: false,
        }
    },
    watch: {
        time: function () {
            this.updateProperties()
            this.setSize()
        },
        data: function () {

        }
    },
    computed: {
        ...mapState('timeline', ['time']),
        ...mapState('player', ['play']),

        src: function () {
            return (this.asset.data.file) ? process.env.VUE_APP_HOST + this.asset.data.file.src : ''
        },

        assetClass: function () {
            let classNames = 'c-asset'

            if (!this.resize && !this.dragging) 
                classNames += ' c-asset--animate'            

            if (!this.isResizable)
                classNames += ' c-asset--autosize'

            return classNames
        },

        textClass: function () {
            let className = ''
            switch (this.asset.data.rank) {
                case 1:
                    className = 'text-info'
                    break;
                case 2:
                    className = 'text-success'
                    break;
                case 3:
                    className = 'text-warning'
                    break;
                case 4:
                    className = 'text-danger'
                    break;
                default:
                    className = 'text-primary'
            }
            return className
        },

        isResizable: function () {
            return (this.asset.data.type == 'LABEL') ? false : true
        }

    },
    methods: {

        handleLoad: function (e) {
            let image = e.currentTarget
            let height = image.naturalWidth
            let width = image.naturalHeight

            if (height && width) {
                this.ratio = Math.round((width / height)*100)/100;
                this.w = 200
                this.h = Math.round(this.w * this.ratio);
            }
        },

        handleUpZ: function () {
            this.z = this.z+1
        },

        handleDownZ: function () {
            this.z = this.z-1
        },

        setSize: function () {
            this.w = Math.round(this.w * this.scale)
            this.h = Math.round(this.h * this.scale) 
        },

        handleDragging: function () {
            this.dragging = true
        },

        handleDragStop: function () {
            this.dragging = false
        },

        handleResize: function () {
            this.resize = true
        },

        handleResizeStop: function (x, y, width) {
            this.resize = false
            if (this.ratio > 0) {
                this.width = width
                this.height = this.h = Math.round(width * this.ratio)
            }
        },

        handleActivation: function () {
            this.active = true
        },

        handleDeactivation: function () {
            this.active = false
        },

        updateProperties: function () {

            let time = this.time

            function filterProps (prop) {
                return prop.timestamp <= time  
            }

            const props = this.asset.props.filter(filterProps)

            if (props.length) {
                let prop = props.slice(-1)[0]
                
                if (prop.action === 'out') {
                    this.visible = false
                } else {
                    this.visible = true
                    this.x = prop.x ? prop.x : 0
                    this.y = prop.y ? prop.y : 0
                    this.z = prop.z ? prop.z : 1
                }
            } else {
                this.visible = false
            }

        },

    },
}
</script>

<style lang="scss">

.c-asset {
    background: white;
    box-shadow: 2px 2px 5px transparentize(black, 0.8);
    position: relative;
    // overflow: hidden;

    &--animate {
        transition: all 0.5s ease-in-out;
    }

    &--autosize {
        width: auto !important;
        height: auto !important;
        padding: 10px 15px;
        box-shadow: none;
        background: none;
        border: none;
    }

    &__header {
        position: absolute;
        top: -32px;
        height: 32px;
    }
}

</style>