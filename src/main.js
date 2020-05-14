import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import TimeFormatter from './services/formatter'
// import Truncate from './services/formatter'

Vue.use(require('vue-moment'))
Vue.use(TimeFormatter)

// Vue.use(Truncate)

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Install BootstrapVue
Vue.use(BootstrapVue)

// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

import VueDragDrop from 'vue-drag-drop';

Vue.use(VueDragDrop)

// import Toast from './services/toast'

import axios from 'axios'
import VueAxios from 'vue-axios'

axios.defaults.baseURL = process.env.VUE_APP_API_HOST + '/v1'

axios.interceptors.request.use(
  (config) => {
    let authKey = store.getters['user/authKey']()
    if (authKey) {
      config.headers['Auth-Key'] = authKey
    }
    return config
  }, 

  (error) => {
    return Promise.reject(error)
  }
);

axios.interceptors.response.use(
  function(response) { return response;}, 
  function(error) {
      if (error.response && error.response.data.errors) {

        for (let key in error.response.data.errors) {
          let message = error.response.data.errors[key]
            console.log('ERROR:: ' + message) // eslint-disable-line no-console
            // Toast.error(message)
        }
      }
      return Promise.reject(error)
});

Vue.use(VueAxios, axios)

import './scss/custom.scss'
import 'video.js/dist/video-js.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
