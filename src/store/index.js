import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import { user } from './user.module'
import { timeline } from './timeline.module'
import { player } from './player.module'
import { project } from './project.module'
import { arrangement } from './arrangement.module'
import { marker } from './marker.module'
import { assets } from './assets.module'
import { keyframe } from './keyframe.module'

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        user,
        timeline,
        player,
        project,
        arrangement,
        marker,
        assets,
        keyframe
    }
});

export default store