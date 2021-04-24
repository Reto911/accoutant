let request = require('request')
let express = require('express')

let app = express();
app.get('/', (req, res) => {
    res.sendFile("C:\\Users\\50877\\Documents\\PROJECT\\accountant\\crop.html")
})
app.use('/', express.static('./'))
app.get('/bing', (req, res, next) => {
    request('http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1', (err, resp, body) => {
        if (!err)
        {
            res.json(body);
        }
    })
}).listen(80);