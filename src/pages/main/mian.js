import Vue from 'vue'
import Main from './main.vue'
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
// import '@/css/theme.scss';
// TODO: 主组件js
Vue.use(VueMaterial);

Vue.material.locale.dateFormat = "yyyy-MM-dd";
Vue.material.locale.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
Vue.material.locale.shortMonths = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
Vue.material.locale.shorterMonths = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
Vue.material.locale.days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
Vue.material.locale.shortDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

Vue.config.productionTip = false

new Vue({
    render: h => h(Main)
}).$mount('#main')
