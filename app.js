let express = require("express")
let app = express()
let https = require("https")

// 接口转发
function getKY(cb) {
    var rawData = '';
    https.get('https://study.163.com/webDev/couresByCategory.htm?pageNo=1&psize=10&type=10', function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            rawData += chunk;
        });
        res.on('end', function() {
            try {
                const parsedData = JSON.parse(rawData);
                cb(parsedData);
            } catch (e) {
                cb('error')
            }
        });
    });
}

app.get("/", (req, res, next) => {
    //res.writeHead(200, { "Content-Type": "application/json" });
    getKY((data) => {
        res.send(JSON.stringify(data));
    })
})

// 模拟跨域请求 处理ajax
app.get("/jsonp", function(req, res, next) {
    getKY((data) => {
        res.jsonp({ status: data });
    })
});

// 模拟跨域请求 处理script
app.get('/callback=:cbk', function(req, res) {
    var bk = req.params.cbk
    getKY((data) => {
        res.send(bk + '(' + JSON.stringify(data) + ')');
    })
})

app.get("/jsonText", function(req, res, next) {
    console.log(req.url);
    let callback = req.url.split("=")[1]
    console.log(callback);

    getKY((data) => {
        // res.jsonp({ status: data });
        res.send(`callback(${JSON.stringify(data)})`)
    })

});

app.listen("3000", () => {
    console.log(`http://localhost:3000`)
})