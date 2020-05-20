<template>
    <!-- <transition name="move">
    </transition> -->
        <vue-draggable-resizable
            :w="w"
            :h="h"
            :x="xpos"
            :y="ypos"
            :z="props.z"
            :lock-aspect-ratio="true"
            :min-width="50"
            :min-height="50"
            :grid="[10,10]"
            :handles="['tl','tr','bl','br']"
            :resizable="isResizable"
            :active="active"
            :class="assetClass"
            :key="componentKey"
            :style="style"
            @dragging="handleDragging"
            @dragstop="handleDragStop"
            @resizing="handleResize"
            @resizestop="handleResizeStop"
            @activated="handleActivation"
            @deactivated="handleDeactivation"
            v-show="xpos"
            >

            <div v-show="active">
                <div class="c-asset__toolbar d-flex flex-row align-end">
                    <span>
                    <b-button-group>
                        <b-button size="sm" variant="primary" 
                            @click.prevent.stop="openUpdateAssetModal">
                            <b-icon-pencil></b-icon-pencil>
                        </b-button>
                        <b-button size="sm" variant="light">
                            <b-icon-arrow-up-short @click.prevent.stop="handleIncreaseZ"></b-icon-arrow-up-short>
                        </b-button>
                        <b-button size="sm" variant="light" @click.prevent.stop="handleDecreaseZ">
                            <b-icon-arrow-down-short></b-icon-arrow-down-short>
                        </b-button>
                        <b-button size="sm" variant="light" @click.prevent.stop="handleRemoveAssetFromKeyframe">
                            <b-icon-x ></b-icon-x>
                        </b-button>
                    </b-button-group>
                    </span> 
                </div>
            </div>

            <h2 :class="['mb-0', textClass]" v-if="asset.type == 'LABEL'">{{ asset.title }}</h2>

            <div v-if="asset.type == 'TEXT'" v-html="asset.content"></div>

            <figure v-show="src">
                <img @load="handleLoad" :src="src" 
                :alt="asset.title" v-b-tooltip.hover.bottom
                :title="asset.title"
                class="img-fluid" ref="image" /> 
            </figure>

        </vue-draggable-resizable>

</template>

<script>

import VueDraggableResizable from 'vue-draggable-resizable'

import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

import { mapState, mapActions } from 'vuex'

export default {
    name: 'DraggableAsset',
    components: {
        VueDraggableResizable
    },
    props: {
        asset: Object,
        props: Object,
        parent: Object
    },
    data: function () {
        return {
            w: 200,
            h: 200,
            xpos: 0,
            ypos: 0,
            ratio: 1,
            dragging: false,
            resize: false,
            visible: true,
            active: false,
            initalWidth: 200,
            componentKey: 0,
            style: {}
        }
    },
    mounted: function () {
        this.updatePosition()
    },

    watch: {
        props: {
            deep: true,
            handler: function () {
                this.updatePosition()
            }
        },
        parent: {
            deep: true,
            handler: function () {
                this.updatePosition()
            }
        }
    },
    computed: {
        ...mapState('timeline', ['time']),
        ...mapState('player', ['play']),
        ...mapState('arrangement', ['keyframes','keyframe']),

        src: function () {
            return (this.asset.file.thumb) ? process.env.VUE_APP_ADMIN_HOST + this.asset.file.thumb : ''
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
            switch (this.asset.rank) {
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
            return (this.asset.type == 'LABEL') ? false : true
        },
        parentWidth: function () {
            return this.parent.width / 2
        },
        parentHeight: function () {
            return this.parent.height / 2
        }

    },
    methods: {

        ...mapActions('keyframe', ['updateProperties','removeAssetFromKeyframe']),
        ...mapActions('assets', ['setTmpAsset']),

        updatePosition: function () {

            const x = Math.round(this.parentWidth / 100 * this.props.x + this.parentWidth)
            const y = Math.round(this.parentHeight / 100 * this.props.y + this.parentHeight)

            this.style.left = x + 'px'
            this.style.top = y + 'px'

            this.xpos = x
            this.ypos = y

            this.setSize()

            this.$nextTick(()=>function () {
                this.forceUpdate()
            })

        },

        handleLoad: function (e) {
            let image = e.currentTarget
            let height = image.naturalWidth
            let width = image.naturalHeight

            if (height && width) {
                this.ratio = Math.round((width/height)*100)/100;
            }

            this.setSize()
        },

        forceUpdate: function () {
            this.componentKey += 1
        },

        handleIncreaseZ: function () {
            this.props.z += 1

            const payload = {
                asset: this.asset,
                props: {
                    z: this.props.z
                }
            }

            this.updateProperties(payload)
        },

        handleDecreaseZ: function () {
            this.props.z -= 1

            const payload = {
                asset: this.asset,
                props: {
                    z: this.props.z
                }
            }

            this.updateProperties(payload)
        },

        setSize: function () {
            this.w = Math.round(this.initalWidth * this.props.scale)
            this.h = Math.round(this.w * this.ratio) 
        },

        handleDragging: function () {
            this.style = {}
            this.dragging = true
        },

        handleDragStop: function (x, y) {
            this.dragging = false

            if (x != this.xpos || y != this.ypos) {    

                this.active = false

                let xpos = x - this.parentWidth;
                let ypos = y - this.parentHeight;

                if (xpos > this.parentWidth || xpos < this.parentWidth * -1) {
                    xpos = this.props.x;
                }
                if (ypos > this.parentHeight || ypos < this.parentHeight * -1) {
                    ypos = this.props.y;
                }

                const relativeX = Math.round(100 / this.parentWidth * xpos * 100) / 100
                const relativeY = Math.round(100 / this.parentHeight * ypos * 100) / 100

                this.props.x = relativeX;
                this.props.y = relativeY;

                const payload = {
                    asset: this.asset,
                    props: this.props
                }

                this.updateProperties(payload)
                    .then(()=> {
                        this.updatePosition()
                    })

            }

        },

        handleResize: function () {
            this.style = {}
            this.resize = true
        },

        handleResizeStop: function (x, y, width) {
            this.resize = false
            const scale = Math.round((width / this.initalWidth)*100)/100;

            const payload = {
                asset: this.asset,
                props: {
                    scale: scale
                }
            }

            this.updateProperties(payload)
                .then(()=> {
                    this.updatePosition()
                })

        },

        handleActivation: function () {
            this.active = true
        },

        handleDeactivation: function () {
            this.active = false
        },

        handleRemoveAssetFromKeyframe: function () {
            this.removeAssetFromKeyframe(this.asset)
        },

        openUpdateAssetModal: function () {
            this.setTmpAsset(this.asset)
            this.$bvModal.show('modal-update-asset')  
        },

    },
}
</script>

<style lang="scss" scoped>

.move {
    
    &-enter {
    }

    &-enter-active {
        transition: all 0.8s ease-out;
        transition-property: width, height, top, left;
    }

    &-enter-to {
    }

    &-leave {
    }

    &-leave-active {
    }

    &-leave-to {
    }
    
}


.c-asset {
    background: white;
    box-shadow: 2px 2px 5px transparentize(black, 0.8);
    position: relative;
    transform: translateX(-50%) translateY(-50%);

    &--animate {
        transition: all 0.5s ease-in-out;
        transition-property: width, height, top, left;
    }

    // &--autosize {
    //     width: auto !important;
    //     height: auto !important;
    //     padding: 10px 15px;
    //     box-shadow: none;
    //     background: none;
    //     border: none;
    // }

    &__toolbar {
        position: absolute;
        top: -32px;
        height: 32px;
    }

    .img-fluid {
        max-width: none;
        width: 100%;
    }
}

</style>