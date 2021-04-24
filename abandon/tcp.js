const request = require('request');
const url = require('url');
request("https://api.no0a.cn/api/bing/0", {},(err, response, body) => {
    let Img = new URL(JSON.parse(body).bing.url);
    // console.log(Img);
    console.log(Img.searchParams.get('id'));
});