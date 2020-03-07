let express = require('express');
let router = express.Router();

/* GET home page. */

const http = require('http');
let serverConfig = require('../servers.json');


let getData = (url) => {
    return new Promise((resolve, reject) => {
        http.get(url, (resp) => {
            let body = "";
            resp.on("data", (chunk => body += chunk));
            resp.on("end", () => {
                resolve(body);
            });
        }).on("error", (err) => {
            resolve(err);
        });
    });
};


router.get('/', async (req, res) => {
    let servers = await Promise.all(serverConfig.servers.map(async server => {
       let data = await getData(server.url).catch(err => console.log(err));
        return {
            name: server.name,
            location: server.location,
            status: data,
            err: (typeof data.code != 'undefined')
        };
    }));

    res.render('index', {servers: servers});
});

module.exports = router;
