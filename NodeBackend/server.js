// JAVASCRIPT SUCKS USE / FOR PATHS NOT \ WHICH IS THE DEFAULT FOR VSCODE

const http = require('node:http');
const fs = require('node:fs');





const server = http.createServer((request, response) => { //listens

    fs.readFile('website.html', (error, data) => {
        if(error) {
            response.writeHead(500, { 'Content-Type': 'text/plain'});
            response.end("ERROR READING");
        }
        else {
            response.writeHead(200, { 'Content-Type': 'text/html'});
            response.end(data);
        }

    });
});

server.listen(3000, () => {
    console.log("Bababooey");
})



