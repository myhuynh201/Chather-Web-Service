//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool

const router = express.Router()

const msg_functions = require('../utilities/exports').messaging

const validation = require('../utilities').validation
let isStringProvided = validation.isStringProvided

/**
 * @api {get} /contacts/:memberId
 * @apiName GetContacts
 * @apiGroup Contacts
 * 
 * @apiDescription Requests all of the usernames of the 
 */
router.get("/:memberId", (request,response, next) => {
    if (request.params.memberId === undefined){
        response.status(400).send({
            message: "Missing required information"
        })
    }
    else if (isNaN(request.params.memberId)){
        response.status(400).send({
            message: "memberId should be a number."
        })
    }
    else{
        next()
    }
}, (request, response) => {
    let query = "SELECT Username, MemberID FROM Members WHERE MemberID != $1 AND (MemberID IN (SELECT MemberID_A FROM CONTACTS WHERE MemberID_B = $1) OR MemberID IN (SELECT MemberID_B FROM CONTACTS WHERE MemberID_A = $1))" 
    let values = [request.params.memberId]
    pool.query(query, values)
    .then(result => {
        response.send({
            rowCount: result.rowCount,
            rows: result.rows
        })
    }).catch(err => {
        response.status(400).send({
            message: "SQL Error",
            error: err
        })
    })
});


/**
 * @api {post} /contacts/:memberIda?/:memberIdb? 
 */
router.post("/", (request, response, next) => {
    if(request.body.memberIda === undefined || request.body.memberIdb === undefined){
        response.status(400).send({
            message: "Missing memberID a or Missing memberID b."
        })
    }
    else if(isNan(request.body.memberIda) || isNan(request.body.memberIdb)){
        response.status(400).send({
            message: "MemberID's must be a number."
        })
    }
    else {
        next()
    }
}, (request, respone, next ) =>{
    let query = 'SELECT Username FROM Members WHERE MemberID = $1 OR MemberID = $2'
    let values = [request.body.memberIda, request.body.memberIdb]

    pool.query(query, values)
    .then(result=>{
        if(result.rowCount !=2){
            response.status(404).send({
                message:"Members not found."
            })
        }
        else{
            next()
        }
    }).catch(error=>{
        response.status(400).send({
            message: "SQL Error on memberid check",
            error: error
        })
    })
}, (request, response, next) => {
    let query = 'SELECT Verified FROM Contacts WHERE (MemberId_A = $1 AND MemberId-B = $2) OR (MemberId_B = $1 AND MemberId_A= $2)'
    let values = [request.body.memberIda, request.body.memberIdb]

    pool.query(query, values)
    .then(result => {
        if(result.rowCount != 0){
            response.status(400).send{
                message:"Contact already exists. already exists"
            }
        } else{
            next()
        }
    }).catch(err => {
        response.status(400).send({
            message:"SQL Error on contact verification check"
        })
    })
}, (request, response) => {
    let query = "INSERT INTO Contacts(MemberID_A, MemberID_B) VALUES ($1, $2)"
    let values = [request.body.memberIda, request.body.memberIdb]

    pool.query(query, values)
    .catch(err => {
        response.status(400).send({
            message:"SQL Error on insert."
        })
    })
})


router.post("/delete", (request, response, next) => {
    if(request.body.memberIda === undefined || request.body.memberIdb){
        response.status(400).send({
            message: "Missing memberida or memberidb."
        })
    }
    else{
        next()
    }
}, (request, response, next) => {
    let query = 'SELECT Verified FROM Contacts WHERE (MemberId_A = $1 AND MemberId-B = $2) OR (MemberId_B = $1 AND MemberId_A= $2)'
    let values = [request.body.memberIda, request.body.memberIdb]

    pool.query(query, values)
    .then(result => {
        if(result.rowCount == 0){
            response.status(400).send({
                message: "There is no contact with these members."
            })
        }
        else{
            next()
        }
    }).catch(error => {
        response.status(400).send({
            message: "SQL Error on searching for the contact"
        })
    })
}, (request, response) => {
    let query = 'DELETE FROM Contacts WHERE (MemberId_A = $1 AND MemberId-B = $2) OR (MemberId_B = $1 AND MemberId_A= $2)'
    let values = [request.body.memberIda, request.body.memberIdb]

    pool.query(query, values)
    .then(result => {
        response.status(400).send({
            message: "Contacts deleted."
        })
    }).catch(error => {
        response.status(400).send({
            message: "SQL error on deleting the contact.",
            error: error
        })
    })
})


module.exports = router