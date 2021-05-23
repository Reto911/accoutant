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
                type TEXT NOT NULL,
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
                type TEXT NOT NULL,
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
    let {date, type, usage, balance, desc} = data;
    let db = new sqlite3.Database(dbPath);
    db.run(`
        INSERT INTO ${username} (date, type, usage, balance, desc)
        VALUES (?, ?, ?, ?, ?)
    `, [date, type, usage, balance, desc], (err) => {callback(err)}).close();
}

exports.insert = insert;

// 改用户记录
function update(dbPath, username, data, callback){
    /* 修改用户记录
    * callback(err) */
    let {id, date, type, usage, balance, desc} = data;
    let db = new sqlite3.Database(dbPath);
    db.run(`
        UPDATE ${username}
        SET date=?2, type=?6, usage=?3, balance=?4, desc=?5
        WHERE id=?1
     `, [id, date, usage, balance, desc, type], (err) => {callback(err)}).close();
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

// 获取LastID
function getLastId(dbPath, username, callback){
    let db = new sqlite3.Database(dbPath);
    db.get('SELECT seq FROM sqlite_sequence WHERE name=?', [username], (err, row) => {callback(err, row)})
        .close();
}

exports.getLastId = getLastId;

// 按日统计收支
function balanceByDate(dbPath, username, callback) {
    let db = new sqlite3.Database(dbPath);
    db.all(`SELECT date, round(SUM(balance), 2) FROM ${username} GROUP BY date`, (err, rows) => {
        callback(err, rows);
    }).close();
}

exports.balanceByDate = balanceByDate;

// 按日统计收入
function incomeByDate(dbPath, username, callback) {
    let db = new sqlite3.Database(dbPath);
    db.all(`SELECT date, round(SUM(balance), 2) FROM ${username} WHERE balance>0 GROUP BY date`, (err, rows) => {
        callback(err, rows);
    }).close();
}
exports.incomeByDate = incomeByDate;

// 按日统计支出
function outcomeByDate(dbPath, username, callback) {
    let db = new sqlite3.Database(dbPath);
    db.all(`SELECT date, round(ABS(SUM(balance)), 2) FROM ${username} WHERE balance<=0 GROUP BY date`, (err, rows) => {
        callback(err, rows);
    }).close();
}
exports.outcomeByDate = outcomeByDate;

// 按类目统计支出
function outcomeByType(dbPath, username, callback) {
    let db = new sqlite3.Database(dbPath);
    db.all(`SELECT type, round(ABS(SUM(balance)), 2) FROM ${username} WHERE balance<=0 GROUP BY type`, (err, rows) => {
        callback(err, rows);
    }).close();
}
exports.outcomeByType = outcomeByType;