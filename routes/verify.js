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
 * @api {Post} /verify?name=params Request to update verification status
 * @apiName PostVerify
 * @apiGroup Verify
 *
 * @apiParam {String} token from email
 *
 * @apiSuccess (Success 201) {String} message confirming verification success
 *
 * @apiError (400: Unable to verify email) {String} message "Email is already verified"
 *
 * @apiError (400: Invalid verification link) {String} message "Invalid link"
 *
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * */

router.post("/", (request, response) => {
    if (request.body.name) {
        console.log(request.body.name);
        let decoded = jwt.decode(request.body.name);
        let theQuery = "SELECT MemberID FROM MEMBERS WHERE Email = $1 AND Verification = 0";
        let values = [decoded.email];
        pool.query(theQuery, values)
            .then(result => {
                if (result.rowCount > 0) {
                    let updateQuery = "UPDATE MEMBERS SET Verification = 1 WHERE Email = $1";
                    pool.query(updateQuery, values)
                        .then(result => {
                            
                            response.redirect("/verify");
                        })
                        .catch(err => {
                            response.status(400).send({
                                message: err.detail
                            });
                          
                        })
                } else {
                    
                    response.status(400).send({
                        message: "Email already verified or does not exist"
                    })
                }
            })
            .catch(err => {
                response.status(400).send({
                    message: err.detail
                });
                
            });
    } else {
        response.status(400).send({
            message: "Invalid link"
        });
       
    }
});

/**
 * @api {get} /success Success HTML splash after the email is verified
 * @apiName GetVerify
 * @apiGroup Verify
 *
 * @apiSuccess (Success 201) {HTML} path Redirects to the Success page
 *
 * @apiError (404: Not Found) {String} message "No such path exists"
 *
 */
router.get("/", (request, response) => {
    response.status(200).sendFile(path.join(__dirname + '/web/verify_successful.html'));
});



module.exports = router;