import Vue from 'vue';
import Login from './Login.vue';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
// import '@/css/theme.scss';

Vue.use(VueMaterial);

new Vue({
    render: h => h(Login)
}).$mount('#login');