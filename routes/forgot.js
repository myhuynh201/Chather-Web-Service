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
require('dotenv').config();

const nodemailer = require('nodemailer');
const log = console.log;

const config = {
    secret: process.env.JSON_WEB_TOKEN
}
let path = require('path');

/**
 * @api {Post} /forgot?name=params Request to reset a forgot password
 * @apiName PostForgot
 * @apiGroup Forgot
 *
 * @apiParam {String} email a user email
 *
 * @apiSuccess (Success 201) {String} message confirming email sent
 *
 * @apiError (400: Email not found) {String} message "Email not found"
 *
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * */

router.post("/", (request, response) => {
    const email = request.body.email;
    let theQuery = "SELECT FirstName, LastName FROM MEMBERS WHERE Email = $1";
    let values = [email];
    
     pool.query(theQuery, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: 'There is no user associated with that email' 
                })
                return
            }

            let firstName = result.rows[0].firstname;
            let lastName = result.rows[0].lastname;

            let token = jwt.sign({email: email},
                config.secret,
                {
                    expiresIn: '1H' // expires in 1 hour
                }
            );

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL, 
                    pass: process.env.PASSWORD
                }
            });

            link="http://"+request.get('host')+"/support?mode=reset&name="+token;
            mailOptions = {
                from: 'chatherapp@gmail.com', 
                to: email, 
                subject: 'Chather: Password Reset',
                html: "Hello " + firstName + " " + lastName + ", <br><br> We're sending you this email because you requested a password reset. " +
                 "Click on this link to create a new password: <br><br><a href="+link+">Set a new password</a><br><br>" + 
                 "If you didn't request a password reset, you can ignore this email. Your password will not be changed."
            };
          
            transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    return log('Error occurs',);
                }
                return log('Email sent!!!');
            });

            response.status(201).send({
                success: true,
                message: 'Email sent'
            })
        })
        .catch((err) => {
            response.status(400).send({
                message: "Error, see detail",
                detail: error.detail
            })
        });
});

module.exports = router;