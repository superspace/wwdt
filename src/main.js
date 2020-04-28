import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import TimeFormatter from './services/formatter'


import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import VueDragDrop from 'vue-drag-drop';

Vue.use(VueDragDrop)

import axios from 'axios'
import VueAxios from 'vue-axios'

axios.defaults.baseURL = process.env.VUE_APP_HOST + '/v1'

axios.interceptors.request.use(
  (config) => {
    let authKey = store.getters['user/authKey'];
    if (authKey) {
      config.headers['Auth-Key'] = authKey;
    }
    return config;
  }, 

  (error) => {
    return Promise.reject(error);
  }
);
 
Vue.use(VueAxios, axios)

import './scss/custom.scss'

import 'video.js/dist/video-js.css'

Vue.config.productionTip = false

Vue.use(require('vue-moment'))
Vue.use(TimeFormatter)

// Install BootstrapVue
Vue.use(BootstrapVue)

// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
