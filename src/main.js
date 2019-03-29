import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'

import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont'

Vue.config.productionTip = false;

Vue.use(Vuetify);

new Vue({
  el: '#app',
  components: {App},
  template: '<App/>'
});
