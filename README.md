# express_js_bypass_cors
When developing front-end applications, we often find ourselves trying to communicate with remote servers via AJAX calls. There's a limitation set by servers that rejects AJAX POST/PUT/DELETE calls. This file bypasses this limitation by bridging between the local server (where AJAX calls are permitted) and the remote server. 
A single app.js file that runs express.js and sends GET/POST requests to remote servers, while serving local static files.
Depends on express, http, body-parser (npm install on each).


****CURRENTLY PROVIDES ONLY GET AND POST CALLS.****
