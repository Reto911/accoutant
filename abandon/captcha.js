const svgCaptcha = require('svg-captcha');
const cookieParser = require('cookie-parser');
const express = require('express');
const fs = require('fs');
const md5 = require('js-md5');

let app = express();
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))
app.use('/', express.static('./files'));
app.use(express.json()) // for parsing application/json
// 获取验证码
function getCaptcha(req, res, next) {
    let captcha = svgCaptcha.create({
        // 翻转颜色
        inverse: false,
        // 字体大小
        fontSize: 42,
        // 噪声线条数
        noise: 1,
        // 宽度
        width: 200,
        // 高度
        height: 60,
    });
    // 保存到session,忽略大小写
    req.session = captcha.text.toLowerCase();
    console.log(req.session); //0xtg 生成的验证码
    // console.log(md5(req.session));
    //保存到cookie 方便前端调用验证
    res.cookie('captcha', md5(req.session), {});
    res.setHeader('Content-Type', 'image/svg+xml');
    res.write(String(captcha.data));
    res.end();
}

app.route("/cap")
    .get((req, res, next) => {
        return getCaptcha(req, res, next);
    })
    .post((req, res, next) => {
        if (md5(req.body.code) === req.cookies.captcha)
            res.send('OK');
        else
            res.send('Fail');
    });
app.route("/")
    .get((req, res, next) => {
            fs.readFile('./files/cap.html', (err, data) => {
                res.type("text/html");
                res.send(data);
            });
        }
    );
app.listen(80);