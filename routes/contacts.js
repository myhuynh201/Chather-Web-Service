//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool

const router = express.Router()

const msg_functions = require('../utilities/exports').messaging

const validation = require('../utilities').validation
let isStringProvided = validation.isStringProvided
let isValidEmail = validation.isValidEmail

/**
 * @api {get} /contacts/:memberId Get contacts for a given memberid
 * @apiName GetContacts
 * @apiGroup Contacts
 * 
 * @apiDescription Requests all of the usernames of the contacts for a member
 * 
 * @apiError (400: SQL error when searching for contacts) SQL ran into an issue searching for the contact.
 */
router.get("/get", (request,response) => {
    let query = "SELECT MemberID, FirstName, LastName, Username FROM Members WHERE MemberID IN (SELECT MemberID_A FROM Contacts WHERE MemberID_B = $1 AND Verified = 1) OR MemberID IN (SELECT MemberID_B FROM Contacts WHERE MemberID_A = $1 AND Verified = 1)"
    let values = [request.decoded.memberid]
    console.log(request.decoded.memberid)
    pool.query(query, values)
    .then(result => {
        response.send({
            rows:result.rows
        })
    })
    .catch(error => {
        response.status(400).send({
            message: "SQL Error when searching for contacts,",
            error:error
        })
    })
});


/**
 * @api {post} /contacts/create Add a contact to the current member
 * @apiName Create Contact
 * @apiGroup Contacts
 * 
 * @apiDescription Given a single member ID create a contact entry with the passed memberID and the current user's memberID.
 * 
 * @apiHeader {Integer} The memberid of the member we're looking to add as a contact.
 * 
 * @apiSuccess (Success 200) {String} Success when the token has been succesfully found by the server.
 * 
 * @apiError (401: Missing target member id) {String} Nothing has been passed in from request.headers.memberid
 * @apiError (402: MemberIDs must be a number) {String} The passed memberID was not a number as is required.
 * @apiError (403: SQL Error on insert) {String} There's been some issue on the SQL server.
 */
router.post("/create", (request, response, next) => {
    if(request.headers.memberid === undefined){
        response.status(401).send({
            message: "Missing target memberid."
        })
    }
    else if(isNaN(request.headers.memberid)){
        response.status(402).send({
            message: "MemberIDs must be a number."
        })
    }
    else {
        next()
    }
}, (request, response, next) => {
    let query = "INSERT INTO Contacts(MemberID_A, MemberID_B) VALUES ($1, $2)"
    let values = [request.decoded.memberid, request.headers.memberid]

    pool.query(query, values)
    .then( result =>
        next()
        )
    .catch(err => {
        response.status(403).send({
            message:"SQL Error on insert."
        })
    })
}, (request, response) => {
    let query = "SELECT token FROM Push_Token WHERE memberid = $1"
    let values = [request.headers.memberid]
    pool.query(query, values)
    .then(result => {
        result.rows.forEach(entry =>
            msg_functions.sendContactRequestToIndividual(
                entry.token, request.headers.memberid))
        response.status(200).send({
            message:"Contact request sent."
        })
    }).catch(err =>{
        response.status(403).send({
            message: "Error finding device pushy token on server."
        })
    })
});


/**
 * @api {delete} /contacts/delete Delete a contact from the current member's contacts list
 * @apiName Delete Contact
 * @apiGroup Contacts
 * 
 * @apiDescription Deletes ANY contact entries with both the current user's memberID and the passed ID.
 * 
 * @apiHeader {String} memberID: The memberID of the user we wish to delete from the server.
 * 
 * @apiSuccess (Success 200) {String} Succceds after deleting contact and sending the pushy notification.
 * 
 * @apiError (400: Missing memberid) Member ID is missing.
 * @apiError (402: There is no contact with these memebers) The memberID passed and the current member do not have a contact entry.
 * @apiError (403: SQL Error on searching for the contact) SQL ran into some sort of issue when querying.
 * @apiError (403: SQL Error on deleting the contact)  SQL error when deleting the contact
 * 
 */
router.post("/delete", (request, response, next) => {
    if(request.headers.memberid === undefined){
        response.status(401).send({
            message: "Missing memberid."
        })
    }
    else{
        next()
    }
}, (request, response, next) => {
    let query = 'SELECT Verified FROM Contacts WHERE (MemberId_A = $1 AND MemberId_B = $2) OR (MemberId_B = $1 AND MemberId_A= $2)'
    let values = [request.headers.memberid, request.decoded.memberid]

    pool.query(query, values)
    .then(result => {
        if(result.rowCount == 0){
            response.status(402).send({
                message: "There is no contact with these members."
            })
        }
        else{
            next()
        }
    }).catch(error => {
        response.status(403).send({
            message: "SQL Error on searching for the contact"
        })
    })
}, (request, response, next) => {
    let query = 'DELETE FROM Contacts WHERE (MemberId_A = $1 AND MemberId_B = $2) OR (MemberId_B = $1 AND MemberId_A= $2)'
    let values = [request.headers.memberid, request.decoded.memberid]

    pool.query(query, values)
    .then(next())   
    }).catch(error => {
        response.status(403).send({
            message: "SQL error on deleting the contact.",
            error: error
        })
    })
}, (request, response) => {
    let query = 'SELECT token FROM PUSH_TOKEN WHERE memberid = $1'
    let values = [request.headers.memberid]

    pool.query(query, values)
    .then(result => {
        result.rows.forEach(
            entry => msg_functions.sendSelfMemberIDToIndividual(
                entry.token, request.headers.memberid))
        response.status(200).send({
            message: "Request sent."
        })
    })
});


/**
 * @api {Search} /contacts/search Find a user
 * @apiName Search for Contact
 * @apiGroup Contacts
 * 
 * @apiDescription Given an username or an email address, find the user associated with it excluding yourself.
 * 
 * @apiSuccess (Success 200: Succesfully got list of users ) {String[]} The SQL rows containing memberiD, firstname, lastname, and username.
 * 
 * @apiError (400: Need a search parameter) Missing the search parameter in the header.
 * @apiError (401: SQL Error) SQL ran into anm issue
 */
router.get("/search", (request, response, next) => 
{
    
    console.log(request.headers.searchp)
    if(request.headers.searchp === undefined)
    {
        response.status(400).send({
            message: "Need a search parameter."
        })
    }
    else
    {
        next()
    }
}, (request, response) => {
        if(isValidEmail(request.headers.searchp))
        {
            let query = "SELECT MemberID, FirstName, LastName, Username FROM Members WHERE Email = $1 AND MemberID NOT IN (SELECT MemberID_A FROM Contacts WHERE MemberID_B = $2) AND MemberID NOT IN (SELECT MemberID_B FROM Contacts WHERE MemberID_A = $2)"
            let values = [request.headers.searchp, request.decoded.memberid]
            pool.query(query,values)
            .then(result =>
                {
                    response.status(200).send({
                        rows: result.rows,
                        message: "Successfully got list of users."
                    })
                })
                .catch(error =>{
                    response.status(401).send({
                        message: "SQL error while looking for email address",
                        error: error
                    })
                })
    }
    else
    {
        let query = "SELECT MemberID, FirstName, LastName, Username FROM Members WHERE Username = $1 AND MemberID NOT IN (SELECT MemberID_A FROM Contacts WHERE MemberID_B = $2) AND MemberID NOT IN (SELECT MemberID_B FROM Contacts WHERE MemberID_A = $2)"
        let values = [request.headers.searchp, request.decoded.memberid]
        pool.query(query,values)
        .then(result =>
            {
                response.send({
                    rows: result.rows
                })
            })
            .catch(error =>{
                response.status(401).send({
                    message: "SQL error while looking for email address",
                    error: error
                })
            })
    }
});

/**
 * @api {Verify} /contacts/verify Verify a contact 
 * @apiName Verify a Contact
 * @apiGroup Contacts
 * 
 * @apiDescription Given a memberID, find and verify the contact associated with it and the current user.
 */
router.post("/verify", (request, response, next) => {
    if(request.headers.memberid === undefined)
    {
        response.status(400).send({
            message: "Missing a memberid"
        })
    }
    else
    {
        next()
    }
},  (request, response, next) => 
{
    let query = "UPDATE Contacts SET Verified = 1 WHERE (MemberID_A = $1 AND MemberID_B = $2)"
    let values = [request.headers.memberid, request.decoded.memberid]
    pool.query(query, values)
    .then(result => {
        response.status(200).send({
            message: "Record updated"
        })
    })
    .catch(error =>{
        response.status(400).send({
            message: "SQL Error updating verification",
            error: error
        })
    })
}, (request, response) => {
    let query = 'SELECT token FROM PUSH_TOKEN WHERE memberid = $1'
    let values = [request.headers.memberid]

    pool.query(query, values)
    .then(result => {
        result.rows.forEach(
            entry => msg_functions.sendSelfMemberIDToIndividual(
                entry.token, request.headers.memberid))
        response.status(200).send({
            message: "Request sent."
        })
    })
})


/**
 * @api {Verify} /contacts/getrequests
 * @apiName Get requests
 * @apiGroup Contacts
 * 
 * @apiDescription Given a userID, find all of that users unverified contacts
 */
router.get("/getrequests", (request, response) => {
    let query = "SELECT MemberID, FirstName, LastName, Username FROM Members WHERE MemberID IN (SELECT MemberID_A FROM Contacts WHERE MemberID_B = $1 AND Verified = 0)"
    let values = [request.decoded.memberid]
    pool.query(query, values)
    .then(result => {
        response.send({
            rows:result.rows
        })
    })
    .catch(error => {
        response.status(400).send({
            message: "SQL Error when searching for contacts,",
            error:error
        })
    })
});
module.exports = router