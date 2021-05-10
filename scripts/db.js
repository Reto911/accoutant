const sqlite3 = require('sqlite3');

// 用户初始化
function init(dbPath, username, force, callback) {
    let db = new sqlite3.Database(dbPath);
    // db.serialize();
    db.get("SELECT * FROM main.sqlite_master WHERE type='table' AND tbl_name=?", [username], (err, row) => {
        if (err) callback(err);
        else {
            if (!row) {
                db.run(`
                CREATE TABLE ${username} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                usage TEXT NOT NULL,
                balance REAL NOT NULL,
                desc TEXT
                );
                `, [], (err) => {
                    callback(err);
                })
            } else if (row && force) {
                db.exec(`DROP TABLE ${username};` + `
                CREATE TABLE ${username} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                usage TEXT NOT NULL,
                balance REAL NOT NULL,
                desc TEXT
                );
                `, err => callback(err));
            } else {
                callback("Existed");
            }
        }
    });
    db.close();
}

exports.init = init;

// 读用户记录
function read(dbPath, username, callback) {
    /* callback(err, rows) */
    let db = new sqlite3.Database(dbPath);
    db.all(`SELECT * FROM ${username}`, [], (err, rows) => {
        callback(err, rows)
    }).close();
}

exports.read = read;

// 写用户记录
function insert(dbPath, username, data, callback){
    /* 写入记录
    * callback(err) */
    let {date, usage, balance, desc} = data;
    let db = new sqlite3.Database(dbPath);
    db.run(`
        INSERT INTO ${username} (date, usage, balance, desc)
        VALUES (?, ?, ?, ?)
    `, [date, usage, balance, desc], (err) => {callback(err)}).close();
}

exports.insert = insert;

// 改用户记录
function update(dbPath, username, data, callback){
    /* 修改用户记录
    * callback(err) */
    let {id, date, usage, balance, desc} = data;
    let db = new sqlite3.Database(dbPath);
    db.run(`
        UPDATE ${username}
        SET date=?2, usage=?3, balance=?4, desc=?5
        WHERE id=?1
     `, [id, date, usage, balance, desc], (err) => {callback(err)}).close();
}

exports.update = update;

// 删用户记录
function del(dbPath, username, id, callback){
    let db = new sqlite3.Database(dbPath);
    db.run(`
        DELETE FROM ${username} WHERE id=?
    `, [id], (err) => {callback(err)}).close();
}

exports.del = del;