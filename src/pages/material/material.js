import Vue from 'vue';
import Material from "@/pages/material/Material.vue";
import VueMaterial  from 'vue-material';
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(VueMaterial );

new Vue({
    el: '#material',
    render: h => h(Material)
  })