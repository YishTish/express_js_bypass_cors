/**
 * Created by yl on 17/07/2017.
 */
const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');

const LISTENING_PORT = 3500;
const REMOTE_PORT = 4300;
const REMOTE_URL = "cvnext90.infoneto.co.il";


app.use(bodyParser.json());
app.get('*', function (appReq, appRes) {
    {
        if(appReq.url.startsWith("/guiapi")){
            http.get('http://'+REMOTE_URL+appReq.url, (res) => {
                const { statusCode } = res;
                const contentType = res.headers['content-type'];

                let error;
                if (statusCode !== 200) {
                    error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
                }
                else if (!/^application\/json/.test(contentType)) {
                    error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
                }
                if (error) {
                    console.error(error.message);
                    // consume response data to free up memory
                    res.resume();
                    return;
                }
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        appRes.status(200).json(parsedData);
                    } catch (e) {
                        console.error(e.message);
                    }
                });
            }).on('error', (e) => {
                console.error(`Got error: ${e.message}`);
            });
        }
        else{
            if(appReq.url == "" || appReq.url.startsWith("?")){
                appRes.sendFile(path.join(__dirname + 'index.html'));
            }
            appRes.sendFile(path.join(__dirname + appReq.path));
        }
    }
});

app.post('*', function (appReq, appRes) {
    {
        const postOptions = {
            hostname: REMOTE_URL,
            path: appReq.url,
            method: 'POST',
            port: REMOTE_PORT,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        //const data = JSON.stringify(appReq.body);
        // postOptions.headers['Content-Length'] = Buffer.byteLength(data);


        const postReq = http.request(postOptions, (res) => {
            const { statusCode } = res;
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            const contentType = res.headers['content-type'];

            let error;
            if (statusCode !== 200) {
                error = 'Request Failed.\n' +
                    `Status Code: ${statusCode}`;
                }
            else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                    `Expected application/json but received ${contentType}`);
            }
            if (error) {
                console.error(error);
                // consume response data to free up memory
                res.resume();
                return;
            }

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    appRes.status(200).json(parsedData);
                } catch (e) {
                    console.error(e.message);
                }
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        });


      postReq.write(JSON.stringify(appReq.body));
      postReq.end();

    }

})

app.listen(LISTENING_PORT, function (request) {
    console.log('Example app listening on port '+ LISTENING_PORT)
})

