const express = require('express');
const request = require('request');
const url = require('url');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const hash = require('hash.js');
const compression = require('compression')

const {dbPath, salt, port} = require('./config')
const users = require('./scripts/users');
const captcha = require('./scripts/captcha')

// 下载背景图, 预期转移到其他文件
function dlFile(uri, filename, callback) {
    let stream = fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close', callback);
}

/* 用于图片目录初始化, 弃用
try {
    fs.accessSync('dist/image/');
} catch (err) {
    fs.mkdirSync('dist/image/')
}
*/
let app = express();

// 图标
app.get('/favicon.ico', (req, res) => {
    fs.readFile('dist/favicon.ico', (err, data) => {
        if (err) {
            console.log(err);
            res.status(404).end();
        } else {
            res.type("image/*").send(data);
        }
    });
});

// TODO: 静态路径配置, 以及主页配置
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(compression());
// 静态资源
app.use('/static', express.static('dist/'))

// 根
app.route('/')
    .get((req, res) => {
        if (!req.cookies.key) {  // 如果不存在密钥
            // console.log("no key");
            res.status(303).location('/users/login').end();
            // res.sendFile(__dirname + '/dist' + '/login.html');
        } else {  // 如果存在密钥且密钥有效
            users.keyCheck(dbPath, req.cookies.key, (err, username) => {
                if (!username || err) {
                    res.status(303).location('/users/login').end();
                }
                console.log(username + "'ve logged in!");
                res.type("text/html").send("Welcome, " + username + '.');
            })

            // res.sendFile(__dirname + '/dist' + '/index.html');
        }

    })
    .post((req, res) => {
        res.status(404).end();
    })

// 用户模块根
app.route('/users')
    .get((req, res) => {
        res.status(403).end();
    })
    .post((req, res) => {
        res.status(403).end();
    })

// 登录
app.use('/users/login', express.json());
app.route('/users/login')
    .get((req, res) => {
        fs.readFile('dist/login.html', (err, data) => {
            if (err) {
                return res.status(404).end();
            } else {
                res.type("text/html").send(data);
            }
        });
    })
    .post((req, res, next) => {
        let {username, password} = req.body;
        users.login(dbPath, username, password, (success) => {
            if (!success) {
                res.send("Password Error");
            } else {
                users.keyGen(dbPath, username, (err, key) => {
                    res.status(200).cookie('key', key, {
                        path: '/'
                    })
                        .send("Logged in")
                        .end();
                })
            }
        })
    });

// 用户注册
app.use("/users/register", express.json());
app.route("/users/register")
    .get((req, res) => {
        res.sendFile(__dirname + '/dist' + '/register.html');
    })
    .post((req, res) => {
        // console.log(req.cookies);
        let iptcode = hash.sha256().update(req.body.code + salt).digest("hex")
        if (req.cookies.captcha !== iptcode) {
            res.send("CAP_ERROR");
            return;
        }
        let info = {
            username: req.body.username,
            password: req.body.password,
            birthday: req.body.birthday,
            val_q: req.body.val_q,
            val_a: req.body.val_a
        };
        users.register(dbPath, info, (err) => {
            if (err) {
                console.log(err);
                res.send("ERROR");
            } else {
                res.send("OK");
            }
        })
    })

// 用户名可用性
app.route('/users/avail')
    .get((req, res) => {
        users.usernameCheck(dbPath, req.query.username, (used) => {
            if (used) {
                res.send("false");
            } else {
                res.send("true");
            }
        })
    })

// 获取用户信息
app.use("/users/inf", express.json());
app.route("/users/inf")
    .post((req, res) => {
        let resJson = {};
        users.getUser(dbPath, req.body.username, (err, row) => {
            if (err) {
                res.send('Error');
            } else if (!row) {
                res.status(404).send('Not-Found')
            } else {
                for (const queryItem of req.body.req) {
                    resJson[queryItem] = row[queryItem]
                }
                res.json(resJson);
            }
        })
    });

// 验证用户信息, 若通过, 则返回一个时长为5min的key
app.use("/users/verify", express.json());
app.route("/users/verify")
    .post((req, res) => {
        if (!req.body.username) {
            res.send("Empty-Username");
            return;
        }
        users.getUser(dbPath, req.body.username, (err, row) => {
            if (err) {
                res.send('Error');
            } else if (!row) {
                res.status(404).send('Not-Found')
            } else {  // 若读取到用户数据
                let incorrect = [];
                for (let prop in req.body) {
                    if (req.body.hasOwnProperty(prop) && req.body[prop] !== row[prop]) {
                        incorrect.push(prop);
                    }
                }
                if (!incorrect.length) {
                    users.keyGen(dbPath, req.body.username, (err, key) => {
                        if (err) {
                            console.error(err);
                        } else {
                            res.cookie('key', key, {
                                maxAge: 300000,
                                path: '/'
                            });
                        }
                        res.json(incorrect);
                    });
                } else {
                    res.json(incorrect);

                }
            }
        })
    })

// 用户密码重置
app.use("/users/reset", express.json());
app.route("/users/reset")
    .get((req, res) => {
        res.sendFile(__dirname + '/dist' + '/reset.html')
    })
    .post((req, res) => {
        users.keyCheck(dbPath, req.cookies.key, (err, username) => {
            if (err || !username) {
                res.send("Failed");
                console.log("1");
                console.log(err);
            } else {
                users.changePassword(dbPath, username, req.body.password, (err) => {
                    if (err) {
                        res.send("Failed");
                    } else {
                        res.send("Succeed");
                    }
                })
            }
        })
    })

// 背景图片缓存
app.route('/bgimg')
    .get((req, res, next) => {
        res.type("text/plain")
        request("http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1", (err, response, body) => {
            if (!err) {
                try {
                    let imgUrl = new URL("https://cn.bing.com" + JSON.parse(body).images[0].url);
                    let fileName = imgUrl.searchParams.get('id');
                    // 检查文件是否存在
                    fs.access('dist/image/' + fileName, fs.constants.R_OK, (err) => {
                        if (err) {
                            dlFile(imgUrl.href, 'dist/image/' + fileName, () => {
                                res.send('/static/image/' + fileName);
                            });
                        } else {
                            res.send('/static/image/' + fileName);
                        }
                    });
                } catch (e) {
                    console.log(e);
                    return;
                }
            } else {
                console.log(err);
                res.status(404);
            }
        });
    });

// 图片验证码

app.route("/utils/captcha")
    .get((req, res) => {
        captcha.getCaptcha(101, 60, (cap) => {
            req.session = cap.text.toLowerCase();
            res.cookie('captcha', hash.sha256().update(req.session + salt).digest("hex"), {
                path: '/users/register',
                maxAge: 600 * 1000
            });
            res.setHeader('Content-Type', 'image/svg+xml');
            res.send(String(cap.data));
        })
    })

app.listen(port);
