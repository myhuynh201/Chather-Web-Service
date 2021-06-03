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
 */
router.get("/get", (request,response, next) => {
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
 * @apiDescription Given two memberid's, add the two members as contacts
 */
router.post("/create", (request, response, next) => {
    if(request.headers.memberid === undefined){
        response.status(401).send({
            message: "Missing target memberid."
        })
    }
    else if(isNaN(request.headers.memberid)){
        response.status(402).send({
            message: "MemberID's must be a number."
        })
    }
    else {
        next()
    }
}, (request, response) => {
    let query = "INSERT INTO Contacts(MemberID_A, MemberID_B) VALUES ($1, $2)"
    let values = [request.decoded.memberid, request.headers.memberid]

    pool.query(query, values)
    .then( result =>
        response.status(200).send({
            message: "Contact created."
        })
        )
    .catch(err => {
        response.status(407).send({
            message:"SQL Error on insert."
        })
    })
});

/**
 * @api {delete} /contacts/delete Delete a contact from the current member's contacts list
 * @apiName Delete Contact
 * @apiGroup Contacts
 * 
 * @apiDescription The desired contact to delete
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
}, (request, response) => {
    let query = 'DELETE FROM Contacts WHERE (MemberId_A = $1 AND MemberId_B = $2) OR (MemberId_B = $1 AND MemberId_A= $2)'
    let values = [request.headers.memberid, request.decoded.memberid]

    pool.query(query, values)
    .then(result => {
        response.status(200).send({
            message: "Contact deleted."
        })
    }).catch(error => {
        response.status(404).send({
            message: "SQL error on deleting the contact.",
            error: error
        })
    })
});


/**
 * @api {findsinglechat} /contacts/1v1 chat Find a chat room
 * @apiName Find a single chat room
 * @apiGroup Contacts
 * 
 * @apiDescription Given two memberid's, remove the two members as contacts
 */
router.post("/1v1chat", (request, response, next) => {
    if(isStringProvided(request.body.memberId)){
        next()
    }
    else{
        response.status(400).send({
            message: "Missing member id"
        })
    }
}, (request, response, next) => {
    if(isNaN(request.body.memberId)){
        response.status(400).send({
            message: "Member ids must be numbers."
        })
    }
    else{
        next()
    }
}, (request, response, next) => {
    let query = "SELECT Username FROM Members WHERE MemberID = $1 OR MemberID = $2"
    let values = [request.body.memberId, request.decoded.memberid]
    pool.query(query, values)
    .then(result => {
        if(result.rowCount == 2){
            next()
        }
        else{
            response.status(400).send({
                message: "One or both of the members do not exist."
            })
        }
    })
}, (request, response) => {
    let query = "SELECT ChatID FROM ChatMembers WHERE (SELECT Count(*) FROM ChatMembers )"
});



/**
 * @api {Search} /contacts/search Find a user
 * @apiName Search Contact
 * @apiGroup Contacts
 * 
 * @apiDescription Given a username or a email address, find the user associated with it.
 */
router.get("/search", (request, response, next) => 
{
    
    console.log(request.headers.searchp)
    if(request.headers.searchp === undefined)
    {
        response.status(420).send({
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
                    response.send({
                        rows: result.rows
                    })
                })
                .catch(error =>{
                    response.status(400).send({
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
                response.status(400).send({
                    message: "SQL error while looking for email address",
                    error: error
                })
            })
    }
});

/**
 * @api {Verify} /contacts/verify Verify a contact 
 * @apiName Search Contact
 * @apiGroup Contacts
 * 
 * @apiDescription Given a username or a email address, find the user associated with it.
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
},  (request, response) => 
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
});


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