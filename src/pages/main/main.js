import Vue from 'vue'
import Main from './main.vue'
import VueMaterial from 'vue-material';
import Vuex from 'vuex';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
// import '@/css/theme.scss';
import '../../css/icon.css'

import VueRouter from "vue-router";
import Home from "@/components/main/Home";
// import storeOption from "./store"
import axios from "axios";

Vue.use(VueMaterial);
Vue.use(VueRouter);
Vue.use(Vuex);

Vue.material.locale.dateFormat = "yyyy-MM-dd";
Vue.material.locale.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
Vue.material.locale.shortMonths = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
Vue.material.locale.shorterMonths = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
Vue.material.locale.days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
Vue.material.locale.shortDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const linkActiveClass = 'md-accent';
Vue.material.router.linkActiveClass = linkActiveClass;
Vue.config.productionTip = false;

// const storeOption =
const min = (a, b) => (a < b) ? a : b;
let store = new Vuex.Store({
    state: {
        data: [],  // 账目数据
        username: "Unknown",  // 用于显示的用户名
        tableInitialized: false  // 表格初始化？
    },
    mutations: {
        setTableInitialized(s, tblInit) {
            s.tableInitialized = tblInit;
        },
        setData(s, data) {
            s.data = data;
        },
        addItem(s, item) {
            s.data.push(item);
        },
        setItem(s, item) {
            for (let i = min(item.id - 1, s.data.length - 1); i >= 0; i--) {
                if (s.data[i].id === e.id) {
                    s.data.splice(i,1, item);
                    break;
                }
            }
        },
        deleteItem(s, id) {
            for (let i = min(id - 1, s.data.length - 1); i >= 0; i--) {
                if (s.data[i].id === id) {
                    s.data.splice(i, 1);
                    break;
                }
            }
        },
        setUsername(s, username) {
            s.username = username;
        }
    },
    actions: {
        refresh({commit}) {  // 刷新数据
            commit('setTableInitialized', false);
            commit('setData', []);
            axios.get('/db/select')
                .then(res => {
                    commit('setData', res.data);
                    commit('setTableInitialized', true);
                })
                .catch(err => {
                    console.error(err);
                    console.log("Server Error");
                })
        },
        getUsername({commit}) {
            axios.get('/users/name')
                .then(res => {
                    commit('setUsername', res.data);
                })
                .catch(err => {
                    if (err) console.error(err);
                });
        },
    }
});

const routes = [
    {path: '/home', name: 'home', component: Home, props: true}
];

const router = new VueRouter({routes, linkActiveClass});

new Vue({
    render: h => h(Main),
    router,
    store
}).$mount('#main')
