//express is the framework we're going to use to handle requests
const express = require('express');

const jwt = require("jsonwebtoken");

//Access the connection to Heroku Database
const pool = require('../utilities').pool;


let router = express.Router();


const bodyParser = require("body-parser");

//Parsing the body of POST requests that are encoded in JSON
router.use(bodyParser.json());

// This allows parsing of the body of POST requests, that are encoded in url
 
router.use(bodyParser.urlencoded());

const config = {
    secret: process.env.JSON_WEB_TOKEN
}
let path = require('path');

/**
 * @api {get} /support Request for support 
 * @apiName GetSupport
 * @apiGroup Support
 *
 * @apiParam {String} mode Type of support page 
 * @apiParam {String} name JWT token containing name data
 *
 * @apiSuccess (Success 201) {HTML} path Redirects to appropriate support page
 *
 * @apiError (404: Not Found) {String} message "No such path exists"
 *
 */

router.get("/", (req, res) => {
    if (req.query.mode) {
        if (req.query.mode === 'verification') {
            res.status(200).sendFile(path.join(__dirname + '/web/verify.html'));
        } else if (req.query.mode === 'reset') {
            res.status(200).sendFile(path.join(__dirname + '/web/reset.html'));
        } else {
            res.status(404).send({
                message: "No such path exists"
            });
        }
    } else {
        res.status(404).send({
            message: "No such path exists"
        });
    }
});

module.exports = router;