<template>
    <vue-draggable-resizable 
        :lockAspectRatio="true"
        :parent="true"
        :w="w" 
        :h="h" 
        :x="x"
        :y="y"
        :z="z"
        :class="assetClass"
        @dragging="onHandleDragging"
        @dragstop="onHandleDragStop"
        v-show="active">

        <!-- :handles="['tl','tr','br','bl']" -->

            <div class="c-asset__header">
                {{ asset.data.title }} <b-badge>{{asset.data.type}}</b-badge>
            </div>

            <figure v-show="asset.data.file" >
                <img @load="onHandleLoad" :src="src" :alt="asset.data.title" class="img-fluid" ref="image" /> 
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
            active: false,
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            z: 1,
            w: 1,
            h: 1,
            scale: 1,
            ratio: 1.3,
            dragging: false
        }
    },
    watch: {
        scale: function () {
        },
        time: function () {
            this.updateProperties()
            this.setSize()
        },
    },
    computed: {
        ...mapState('timeline', ['time']),
        ...mapState('player', ['play']),

        src: function () {
            return (this.asset.data.file) ? process.env.VUE_APP_HOST + this.asset.data.file.src : ''
        },

        assetClass: function () {
            let classes = 'c-asset'
            classes += ' c-asset--animate' 

            // if (this.play) {
            // }

            return classes;            
        }
    },
    methods: {

        onHandleLoad: function (e) {
            let image = e.currentTarget
            this.height = image.naturalWidth
            this.width = image.naturalHeight
            if (this.height && this.width) this.ratio = this.width / this.height;

        },

        setSize: function () {
            this.w = Math.round(150 * this.scale)
            this.h = Math.round(this.w * this.ratio) 
        },

        onHandleDragging: function () {
            this.dragging = true
        },

        onHandleDragStop: function () {
            this.dragging = false
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
                    this.active = false
                } else {
                    this.active = true
                    this.x = prop.x ? prop.x : 0
                    this.y = prop.y ? prop.y : 0
                    this.z = prop.z ? prop.z : 1
                    this.scale = prop.scale ? prop.scale : 1
                }
            } else {
                this.active = false
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
    overflow: hidden;

    &--animate {
        transition: all 0.5s ease-in-out;
    }

    &__header {
        position: absolute;
        width: 100%;
        background: white;
        padding: 6px 8px;
    }
}

</style>