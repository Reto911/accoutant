import Vue from 'vue'
import Main from './main.vue'
import VueMaterial from 'vue-material';
import Vuex from 'vuex';
import axios from "axios";
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
// import '@/css/theme.scss';
import '../../css/icon.css'

import VueRouter from "vue-router";
import Home from "@/components/main/Home";
import Statistic from "@/components/main/Statistic";
import Settings from "@/components/main/Settings";


Vue.use(VueMaterial);
Vue.use(VueRouter);
Vue.use(Vuex);

Vue.material.locale.dateFormat = "yyyy-MM-dd";
Vue.material.locale.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
Vue.material.locale.shortMonths = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
Vue.material.locale.shorterMonths = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
Vue.material.locale.days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
Vue.material.locale.shortDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
// const linkActiveClass = 'md-accent';
// Vue.material.router.linkActiveClass = linkActiveClass;
Vue.config.productionTip = false;

// const storeOption =
const min = (a, b) => (a < b) ? a : b;
let store = new Vuex.Store({
    state: {
        data: [],  // 账目数据
        balanceByDate: [['date'], ['balance']],
        outcomeByDate: [['date'], ['outcome']],
        incomeByDate: [['date'], ['income']],
        outcomeByType: [['type'], ['outcome']],
        username: "Unknown",  // 用于显示的用户名
        tableInitialized: false,  // 表格初始化？,
        lastID: 0
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
                if (s.data[i].id === item.id) {
                    s.data.splice(i, 1, item);
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
        },
        setLastID(s, id) {
            s.lastID = id;
        },
        setBalanceByDate(s, items) {
            s.balanceByDate = [['date'], ['balance']];
            for (let i of items) {
                s.balanceByDate[0].push(i['date']);
                s.balanceByDate[1].push(i['round(SUM(balance), 2)']);
            }
        },
        setOutcomeByDate(s, items) {
            s.outcomeByDate = [['date'], ['outcome']]
            for (let i of items) {
                s.outcomeByDate[0].push(i['date']);
                s.outcomeByDate[1].push(i['round(ABS(SUM(balance)), 2)']);
            }
        },
        setIncomeByDate(s, items) {
            s.incomeByDate = [['date'], ['income']];
            for (let i of items) {
                s.incomeByDate[0].push(i['date']);
                s.incomeByDate[1].push(i['round(SUM(balance), 2)']);
            }
        },
        setOutcomeByType(s, items) {
            s.outcomeByType = [['type'], ['outcome']];
            for (let i of items) {
                s.outcomeByType[0].push(i['type']);
                s.outcomeByType[1].push(i['round(ABS(SUM(balance)), 2)']);
            }
        },
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
            axios.get('/db/select/balanceByDate')
                .then(res => {
                    commit('setBalanceByDate', res.data);
                })
                .catch(err => {
                    console.error(err);
                    console.log("Server Error");
                })
            axios.get('/db/select/incomeByDate')
                .then(res => {
                    commit('setIncomeByDate', res.data);
                })
                .catch(err => {
                    console.error(err);
                    console.log("Server Error");
                })
            axios.get('/db/select/outcomeByDate')
                .then(res => {
                    commit('setOutcomeByDate', res.data);
                })
                .catch(err => {
                    console.error(err);
                    console.log("Server Error");
                })
            axios.get('/db/select/outcomeByType')
                .then(res => {
                    commit('setOutcomeByType', res.data);
                })
                .catch(err => {
                    console.error(err);
                    console.log("Server Error");
                })
        },
        getUsername({commit}) {
            return new Promise((resolve, reject) => {
                axios.get('/users/name')
                    .then(res => {
                        commit('setUsername', res.data);
                        resolve();
                    })
                    .catch(err => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        }
                    });
            })
        },
        getLastId({commit}) {
            return new Promise((resolve, reject) => {
                axios.get('/db/id')
                    .then(res => {
                        if (!res.data) {
                            commit('setLastID', 0);
                            resolve();
                        } else {
                            commit('setLastID', res.data.seq);
                            resolve();
                        }
                    })
                    .catch(err => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        }
                    });
            })
        },
        update({commit}, payload) {  // 插入或更新
            return new Promise((resolve, reject) => {
                if (payload.newItem) {
                    axios.post('/db/insert', payload.item)
                        .then(res => {
                            if (res.status === 404) {
                                reject();
                            } else {
                                commit('addItem', payload.item);
                                resolve();
                            }
                        }).catch(err => {
                        console.error(err);
                        reject(err);
                    });
                } else {
                    axios.post('/db/update', payload.item)
                        .then(res => {
                            if (res.status === 404) {
                                reject();
                            } else {
                                commit('setItem', payload.item);
                                resolve();
                            }
                        }).catch(err => {
                        console.error(err);
                        reject(err);
                    });
                }
            })
        },
        drop({commit}, payload) {  // 删除
            return new Promise((resolve, reject) => {
                axios.post('/db/delete', {id: payload.id})
                    .then(res => {
                        if (res.status === 404) {
                            reject();
                        } else {
                            commit('deleteItem', payload.id);
                            resolve();
                        }
                    }).catch(err => {
                    console.error(err);
                    reject(err);
                });
            })
        },
    }
});

const routes = [
    {
        path: '/home',
        name: 'home',
        component: Home,
        meta: {
            title: '主页'
        }
    },
    {
        path: '/statistic',
        name: 'statistic',
        component: Statistic,
        meta: {
            title: '统计'
        }
    },
    {
        path: '/settings',
        name: 'settings',
        component: Settings,
        meta: {
            title: '设置'
        }
    }
];

const router = new VueRouter({routes});

router.afterEach((to, from) => {
    if (to.meta.title){
        document.title = to.meta.title;
    }
})

new Vue({
    render: h => h(Main),
    router,
    store
}).$mount('#main')
