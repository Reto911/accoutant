import axios from "axios";

const storeOption = {
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
}

export default storeOption