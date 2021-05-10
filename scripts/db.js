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
                id INT PRIMARY KEY NOT NULL,
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
                id INT PRIMARY KEY NOT NULL,
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

// TODO: 读用户记录
function read(dbPath, username, callback) {
    /* callback(err, rows) */
    let db = new sqlite3.Database(dbPath);
    db.all("SELECT * FROM ?", [username], (err, rows) => {
        callback(err, rows)
    }).close();
}

exports.read = read;

// TODO: 写用户记录

// TODO: 改用户记录

// TODO: 删用户记录