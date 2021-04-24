const svgCaptcha = require('svg-captcha');
const hash = require('hash.js');

// 获取验证码
function getCaptcha(w, h, callback) {
    let captcha = svgCaptcha.create({
        // 翻转颜色
        inverse: false,
        // 字体大小
        fontSize: 42,
        // 噪声线条数
        noise: 1,
        // 宽度
        width: w,
        // 高度
        height: h,
    });
    callback(captcha);
}
exports.getCaptcha = getCaptcha;

function verifyCaptcha(ipt, coded, salt)
{
    let raw = ipt+salt;
    let cod = hash.sha256().update(raw).digest("hex");
    return raw === cod;
}
exports.verifyCaptcha = verifyCaptcha;