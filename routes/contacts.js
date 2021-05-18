//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool

const router = express.Router()

const msg_functions = require('../utilities/exports').messaging

const validation = require('../utilities').validation
let isStringProvided = validation.isStringProvided

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
    let query = "SELECT Username FROM Members WHERE MemberID != $1 AND (MemberID IN (SELECT MemberID_A FROM CONTACTS WHERE MemberID_B = $1) OR MemberID IN (SELECT MemberID_B FROM CONTACTS WHERE MemberID_A = $1))" 
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
module.exports = router