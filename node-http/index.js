const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    // console.log(req.headers);
    console.log("Request for " + req.url + " by method " + req.method);
    if(req.method == 'GET') {    // this server will only handle GET requests
        var fileUrl;
        if(req.url == "/") {    // if user does not enter any route, default to index.html
            fileUrl = "/index.html";
        }
        else {
            fileUrl = req.url;
        }
        var filePath = path.resolve('./public' + fileUrl);
        var fileExt = path.extname(filePath);
        if(fileExt == ".html") {
            if(!fs.existsSync(filePath)) {       // he used exists (w/callback) but it is deprecated now
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/html');
                res.end('<html><body><h1>Error: 404 ' + fileUrl + ' not found</h1></body></html>');
                return;
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                fs.createReadStream(filePath).pipe(res);   // get contents of file at filePath and pipe to res
            }
        }
        else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end('<html><body><h1>Error: 404 ' + fileUrl + ' not an HTML file</h1></body></html>');
            return;
        }
    }
    else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body><h1>Error: 404 ' + req.method + ' not supported</h1></body></html>');
        return;
    }
    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'text/html');
    // res.end('<html><body><h1>Hello, World!</h1></body></html>');
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});