const sqlite3 = require('sqlite3');
// const md5 = require('js-md5');
let {init} = require('./db')
const hash = require('hash.js');

// console.log(hash.sha256().update("root").digest("hex"));

// 登录模块

function login(dbPath, username, pwd_coded, callback) {
    /* 登录函数, 尝试登录指定账号, 然后执行回调函数.
    *
    *  dbPath: 数据库路径
    *
    *  username: 用户名
    *
    *  pwd_coded: 加密后的密码
    *
    *  callback: 回调函数, 唯一的参数是一个布尔值, 仅当登陆成功是它为真
    *  */
    let db = new sqlite3.Database(dbPath);
    db.get("SELECT * FROM users WHERE username=? AND password=?", [username, pwd_coded], (err, row) => {
        if (err || !row) {
            callback(false);
        } else {
            callback(true);
        }
    }).close();
}

exports.login = login;

// 密钥相关

function keyGen(dbPath, username, callback) {
    /* 生成密钥, 并写数据库 */
    let now = new Date().getTime();
    const key = hash.sha256().update(username + now).digest('hex');
    let db = new sqlite3.Database(dbPath);
    db.serialize()
        .run("UPDATE keys SET valuable=0 WHERE username=? AND valuable=1 AND long_term=0", [username])  // 保证只有一个密钥生效
        .run("INSERT INTO keys (username, user_key, gen_time) VALUES (?, ?, ?)",
            [username, key, parseInt(now / 1000)],
            (err) => {
                callback(err, key);
            })
        .parallelize()
        .close();
}

exports.keyGen = keyGen;

/* 校验密钥. 若通过, 则调用回调函数, 并传入用户名作为第二个实参. */
function keyCheck(dbPath, key, callback) {
    let db = new sqlite3.Database(dbPath);
    db.get("SELECT username, valuable FROM keys WHERE user_key=?", [key], (err, row) => {
        if (!row) {
            callback(err, undefined);
            return;
        }
        if (row.valuable) {
            callback(err, row.username);
        } else {
            callback(err, undefined);
        }
    }).close();
}

exports.keyCheck = keyCheck;

function keyClean(dbPath, callback) {
    /* 清除失效的密钥 */
    let db = new sqlite3.Database(dbPath);
    db.run("DELETE FROM keys WHERE valuable=0", err => callback(err))
        .close();
}

exports.keyClean = keyClean;

function keyDisable(dbPath, key, callback) {
    /* 使密钥失效, 只支持传入密钥
    * callback(err) */
    let db = new sqlite3.Database(dbPath);
    db.run('UPDATE keys SET valuable=0 WHERE user_key=? AND valuable=1 AND long_term=0', [key], err => {
        callback(err)
    }).close();
}

exports.keyDisable = keyDisable;

// 注册模块

function usernameCheck(dbPath, username, callback) {
    /* 检查用户名是否可用 */
    let db = new sqlite3.Database(dbPath);
    db.get("SELECT username FROM users WHERE username=?", [username], (err, row) => {
        if (err) {
            return console.error(err);
        }
        if (!row) {
            callback(false);
        } else {
            callback(true);
        }
    })
}

exports.usernameCheck = usernameCheck;

function register(dbPath, info, callback) {
    let db = new sqlite3.Database(dbPath);
    let {username, password, birthday, val_q, val_a} = info;
    let now = new Date().getTime() / 1000;
    now = parseInt(now)
    db.run("INSERT INTO users (username, password, reg_time, birthday, val_q, val_a) VALUES (?, ?, ?, ?, ?, ?)",
        [username, password, now, birthday, val_q, val_a], err => {
            callback(err);
        }).close();
    init(dbPath, username, false, (err) => {
        if (err) console.log(err);
    })
}

exports.register = register;

// 密码修改
function changePassword(dbPath, username, nPwd, callback) {
    /* callback(err) */
    let db = new sqlite3.Database(dbPath);
    db.run("UPDATE users SET password=? WHERE username=?", [nPwd, username], (err) => {
        callback(err);
    }).close();
}

exports.changePassword = changePassword;

//
function getUser(dbPath, username, callback) {
    /* 获取用户信息
    *  callback(err, row) */
    let db = new sqlite3.Database(dbPath);
    db.get("SELECT * FROM users WHERE username=?", [username], (err, row) => callback(err, row))
        .close();
}

exports.getUser = getUser;

// 删除用户
function dropUser(dbPath, username, callback) {
    let db = new sqlite3.Database(dbPath);
    db.run(`DROP TABLE ${username}`, [], (err) => {
        if (err) {
            callback(err);
            return;
        }
        db.run("DELETE FROM users WHERE username=?", [username], err => callback(err));
    })
        .run("DELETE FROM keys WHERE username=?", [username], (err) => {
            if (err) console.log(err)
        })
        .close();
}

exports.dropUser = dropUser;

// 列出用户(root专用)
function  listUsers(dbPath, callback){
    let db = new sqlite3.Database(dbPath);
    db.all(`
        SELECT id, username, password, datetime(reg_time, 'unixepoch', 'localtime') AS RegTime, seq
        FROM users
        LEFT OUTER JOIN sqlite_sequence AS ss
        ON users.username = ss.name;
    `, (err, rows) => {
        callback(err, rows);
    })
}

exports.listUsers = listUsers;