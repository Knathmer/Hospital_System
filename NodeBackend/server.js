// JAVASCRIPT SUCKS USE / FOR PATHS NOT \ WHICH IS THE DEFAULT FOR VSCODE

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const server = http.createServer((request, response) => { //listens

    if (request.url === '/' || request.url === '/index.html') {
        fs.readFile('website.html', (error, data) => {
            if (error) {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end("ERROR READING HTML FILE");
            } else {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(data);
            }
        });
    } else if (request.url === '/website.js') {
        fs.readFile('website.js', (error, data) => {
            if(error){
                response.writeHead(500, { 'Content-Type': 'application/javascript' });
                response.end("ERROR");
            }
            else{
                response.writeHead(200);
                response.end(data);
            }
        });
    }
    else{
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end('404 Not Found');
    }
});

server.listen(3000, () => {
    console.log("Bababooey");
})



