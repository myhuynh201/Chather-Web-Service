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

const generateHash = require('../utilities').generateHash
const generateSalt = require('../utilities').generateSalt


/**
 * @api {post} /reset Request to reset a password
 * @apiName PostReset
 * @apiGroup Reset
 *
 * @apiParam {String} name token that contain email
 * @apiParam {String} password the new password
 * @apiParam {String} confirm the confirm password
 *
 * @apiSuccess (Success 201) {boolean} success true when password is updated
 * @apiSuccess (Success 201) {String} message "Password updated!"
 *
 * @apiError (400: Bad Token) {String} message "Token expired or invalid"
 *
 * @apiError (400: Bad Request) {String} message "Invalid request"
 *
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 */
router.post('/', (request, response) => {

    if (request.body.name && request.body.password && request.body.password2 && request.body.password === request.body.password2) {

        console.log(request.body.name);
        console.log(request.body.password);
        console.log(request.body.password2);

        let decoded = jwt.decode(request.body.name);
        console.log(decoded.email)
        let theQuery = "SELECT MemberID FROM MEMBERS WHERE Email = $1";
        let values = [decoded.email];

        pool.query(theQuery, values)
            .then(result => {
                if (result.rowCount > 0) {
                    let updateQuery = "UPDATE MEMBERS SET Password = $1, Salt = $2 WHERE Email = $3";
                    let salt = generateSalt(32);
                    let newPW = generateHash(request.body.password, salt);
                    let updateValues = [newPW, salt, decoded.email];
                    pool.query(updateQuery, updateValues)
                        .then(result => {
                            response.redirect("/reset");
                        })
                        .catch(err => {
                            response.status(400).send({
                                message: err.detail
                            });
                        });
                } else {
                    response.status(400).send({
                         message: "Request failed"
                    });
                }
            })
            .catch(err => {
                response.status(400).send({
                    message: err.detail
                })
            });

    } else {
        response.status(400).send({
            message: "Invalid request"
        });
    }

    
});

/**
 * @api {get} /reset HTML page that user can reset their password
 * @apiName GetReset
 * @apiGroup Reset
 *
 * @apiSuccess (Success 201) {HTML} path Redirects to the reset page
 *
 * @apiError (404: Not Found) {String} message "No such path exists"
 *
 */
router.get("/", (request, response) => {
    response.status(200).sendFile(path.join(__dirname + '/web/reset_successful.html'));
});

module.exports = router;


    