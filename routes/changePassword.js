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

const validation = require('../utilities').validation
let isStringProvided = validation.isStringProvided
let isValidPassword = validation.isValidPassword

/**
 * @api {post} /changePassword Request to change a password
 * @apiName PostChangePassword
 * @apiGroup Reset
 *
 * @apiParam {String} email token that contain email
 * @apiParam {String} oldPW the current password
 * @apiParam {String} newPW the new password
 * @apiParam {String} confirmPW the confirm new password
 *
 * @apiSuccess (Success 201) {boolean} success true when password is updated
 * @apiSuccess (Success 201) {String} message "Your Password has been changed"
 *
 * @apiError (400: Bad Token) {String} message "Token expired or invalid"
 *
 * @apiError (400: Bad Request) {String} message "Invalid request"
 *
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 */
router.post('/', (request, response) => {

    const email = request.body.email;
    const oldPW = request.body.oldPW;
    const newPW = request.body.newPW;
    const confirmPW = request.body.confirmPW;


    if (isStringProvided(oldPW) && isStringProvided(newPW) && isStringProvided(confirmPW)) {
        if(isValidPassword(newPW)) {
            if(newPW === confirmPW) {
                let theQuery = "SELECT MemberID, Password, Salt FROM MEMBERS WHERE Email = $1";
                let values = [email];
                pool.query(theQuery, values)
                    .then(result => {
                        if (result.rowCount > 0) {

                            //Retrieve the salt used to create the salted-hash provided from the DB
                            let salt = result.rows[0].salt
                                       
                            //Retrieve the salted-hash password provided from the DB
                            let storedSaltedHash = result.rows[0].password 

                            //Generate a hash based on the stored salt and the provided current password
                            let providedSaltedHashOldPW = generateHash(oldPW, salt)

                            //Generate a hash based on the stored salt and the provided new password
                            let providedSaltedHashNewPW = generateHash(newPW, salt)

                            //Did our salted hash match their salted hash?
                            if (storedSaltedHash === providedSaltedHashOldPW ) {

                                if (storedSaltedHash != providedSaltedHashNewPW ) {

                                    let updateQuery = "UPDATE MEMBERS SET Password = $1 WHERE Email = $2";
                                    let updateValues = [providedSaltedHashNewPW, email];
                                    pool.query(updateQuery, updateValues)
                                        .then(result => {

                                            response.status(201).send({
                                                message: "Your Password has been changed."
                                            })  

                                        })
                                        .catch(err => {
                                            response.status(400).send({
                                                message: "OOps Error in SQL and the password has not changed unfortunately"
                                            });
                                        });

                                } else {
                                    response.status(400).send({
                                        message: "New password must be different from old one!"
                                    }); 
                                }
                            } else {
                                response.status(400).send({
                                    message: "Your previous password is not matching provided password! Please try again..."
                                });
                            }

                        } else {
                            response.status(400).send({
                                message: "Email not found!"
                            });
                        }
                    })
                    .catch(err => {
                        response.status(400).send({
                            message: "SQL error"
                        })
                    });

            
            } else {
                response.status(400).send({
                    message: "Passwords do not match."
                });
            }

        } else {
            response.status(400).send({
                message: "Your new password is too weak. Password must be at least 7 characters, contain a special character, a number, and both upper/lowercase letters."
            });
        }

    } else {
        response.status(400).send({
            message: "Missing required information"
        });
    }

    
});


module.exports = router;

