const http = require('http'); //Assigns alias to http package
const fs = require('fs');



const server = http.createServer((request, response) => { //listens

    fs.readFile("test.html", (error, data) => {
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