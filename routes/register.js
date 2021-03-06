//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../utilities').pool

const validation = require('../utilities').validation
let isStringProvided = validation.isStringProvided
let isValidEmail = validation.isValidEmail
let isValidPassword = validation.isValidPassword

const generateHash = require('../utilities').generateHash
const generateSalt = require('../utilities').generateSalt

const sendVerificationEmail = require('../utilities/email').sendVerificationEmail;


var router = express.Router()


const jwt = require("jsonwebtoken")
const config = {
    secret: process.env.JSON_WEB_TOKEN
}

const bodyParser = require("body-parser")
//Parsing the body of POST requests that are encoded in JSON
router.use(bodyParser.json())

require('dotenv').config();

const nodemailer = require('nodemailer');
const log = console.log;
var first, last, username, email, password;
var mailOptions, link;
/**
 * @api {post} /auth Request to register a user
 * @apiName PostAuth
 * @apiGroup Auth
 * 
 * @apiParam {String} first a users first name
 * @apiParam {String} last a users last name
 * @apiParam {String} email a users email *unique
 * @apiParam {String} password a users password
 * @apiParam {String} [username] a username *unique, if none provided, email will be used
 * 
 * @apiParamExample {json} Request-Body-Example:
 *  {
 *      "first":"FirstName",
 *      "last":"LastName",
 *      "email":"test@fake.email",
 *      "password":"test12345"
 *  }
 * 
 * @apiSuccess (Success 201) {boolean} success true when the name is inserted
 * @apiSuccess (Success 201) {String} email the email of the user inserted 
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: Username exists) {String} message "Username exists"
 * 
 * @apiError (400: Email exists) {String} message "Email exists"
 *  
 * @apiError (400: Other Error) {String} message "other error, see detail"
 * @apiError (400: Other Error) {String} detail Information about the error
 * 
 */ 
router.post('/', (request, response) => {

    //Retrieve data from query params
    first = request.body.first
    last = request.body.last
    username = isStringProvided(request.body.username) ?  request.body.username : request.body.email
    email = request.body.email
    password = request.body.password
    let token = jwt.sign({email: email},
        config.secret,
        {
            expiresIn: '1H' // expires in 1 hour
        }
    );
    //Verify that the caller supplied all the parameters
    //In js, empty strings or null values evaluate to false
    if(isStringProvided(first) 
        && isStringProvided(last) 
        && isStringProvided(username) 
        && isStringProvided(email) 
        && isStringProvided(password)) {
            if(isValidEmail(email)){
                if(isValidPassword(password)) {            
                //We're storing salted hashes to make our application more secure
                let salt = generateSalt(32)
                let salted_hash = generateHash(password, salt)
                
                //We're using placeholders ($1, $2, $3) in the SQL query string to avoid SQL Injection
                let theQuery = "INSERT INTO MEMBERS(FirstName, LastName, Username, Email, Password, Salt) VALUES ($1, $2, $3, $4, $5, $6) RETURNING Email"
                let values = [first, last, username, email, salted_hash, salt]
                pool.query(theQuery, values)
                    .then(result => {
                        //We successfully added the user!
                        response.status(201).send({
                            success: true,
                            email: result.rows[0].email
                        })
                        //sendVerificationEmail(result.rows[0].email);                       
                        let transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.EMAIL, 
                                pass: process.env.PASSWORD
                            }
                        });

                        link="http://"+request.get('host')+"/support?mode=verification&name="+token;
                        mailOptions = {
                            from: 'chatherapp@gmail.com', 
                            to: result.rows[0].email, 
                            subject: 'Welcome! Verification required',
                            html: "Welcome to Chather! <br><br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
                        };
                      
                        transporter.sendMail(mailOptions, (err, data) => {
                            if (err) {
                                return log('Error occurs',);
                            }
                            return log('Email sent!!!');
                        });

                    })
                    .catch((error) => {
                        //log the error
                        // console.log(error)
                        if (error.constraint == "members_username_key") {
                            response.status(400).send({
                                message: "Username exists"
                            })
                        } else if (error.constraint == "members_email_key") {
                            response.status(400).send({
                                message: "Email exists"
                            })
                        } else {
                            response.status(400).send({
                                message: "other error, see detail",
                                detail: error.detail
                            })
                        }
                    })
                } else {
                    response.status(400).send({
                        message: "Invalid Password"
                    })
                }
            } else {
                response.status(400).send({
                    message: "Invalid Email"
                })
            }
                

    } else {
        response.status(400).send({
            message: "Missing required information"
        })
    }
})

module.exports = router