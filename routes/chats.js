//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool

const router = express.Router()

const validation = require('../utilities').validation
let isStringProvided = validation.isStringProvided

/**
 * @api {put} /chats/newChat/usernames Create a new chat with given members
 * @apiName New Chat
 * @apiGroup Chats
 * 
 * @apiDescription Create a new chat and insert sender and recipient members. 
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {JSONArray} members Recipient(s) of the new chat
 * 
 * @apiSuccess {boolean} success true when the name is inserted
 * 
 * @apiError (404: Chat Not Found) {String} message "chatID not found"
 * @apiError (404: Email Not Found) {String} message "email not found"
 * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. chatId must be a number" 
 * @apiError (400: Duplicate Email) {String} message "user already joined"
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
 router.put("/startChat/usernames", (request, response, next) => {
    //validate on empty parameters
    let members = [request.body.members]
    if (!request.body.members) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else if (members.length < 1) {
        response.status(400).send({
            message: "Malformed parameter. Must send at least one member"
        })
    } else {
        next()
    }
    },(request, response, next)=>{
        let members = [request.body.members]
        let membersExistQuery = `SELECT memberid, username FROM members WHERE username IN ('${members[0].join("', '")}')`
        console.log(membersExistQuery)
        pool.query(membersExistQuery)
        .then(result => {
            inputCount = members[0].length
            queryCount = result.rowCount
            if (inputCount == queryCount) {
                console.log("all members found!") 
                console.log(queryCount + " found out of " + inputCount)
                next()
            } else {
                console.log(queryCount + " found out of " + inputCount)

                response.status(400).send({
                    message: `Not all members are found. Only found ${result.rows}`,
                })
            }
        })
        .catch(error=> {
            console.log("error: problem finding members")

            response.status(400).send({
                message: "SQL Error",
                error: error,
                query: query
            })
        }) 
    }, (request, response, next) => {
        //validate chat id exists
        let members = [request.body.members]
        let query = `SELECT chatmembers.*, members.username FROM chatmembers LEFT JOIN members ON chatmembers.memberid=members.memberid WHERE members.username IN ('${members[0].join("', '")}') AND chatmembers.chatid NOT IN (SELECT chatmembers.chatid FROM chatmembers LEFT JOIN members ON chatmembers.memberid=members.memberid WHERE members.username NOT IN ('${members[0].join("', '")}'));`
        // if chat containing all members exists return chat
        console.log(query)
        pool.query(query)
        .then(result => {
            console.log(result.rowCount + " : " + result.rows[0].memberid)
            if (result.rowCount > 0) {
                console.log("found!!")

                response.send({
                    success: 'Chat Exists',
                    chatID:result.rows[0].chatid,
                    members: members[0]
                })
            } else {
                console.log("creating new chat...")
                let insertQuery = `INSERT INTO Chats(Name) VALUES ('${members}') RETURNING ChatId`
                console.log(insertQuery)

                pool.query(insertQuery)
                    .then(result => {
                        console.log("inserted chat..." + result.rows[0].chatid)
                        
                        let chatid = result.rows[0].chatid
                        console.log(members + " : " + members[0][0])
                        var addMembersQuery = `INSERT INTO chatmembers (ChatId, MemberId) VALUES (${chatid},${members[0][0]})`
                        for (i = 1; i < members.length; i++) {
                            console.log('chatid: ' + chatid + ', memberids'+ members[0][i])
                            addMembersQuery += `, (${chatid},${members[0][i]})`
                        }

                        console.log(addMembersQuery)
                        pool.query(addMembersQuery)
                        .then(result => {
                            console.log("created chat and added members...")
                            console.log(addMembersQuery)

                            response.send({
                                success: 'Chat created',
                                chatID:chatid,
                                members: members[0]
                            })
                        }).catch(err => {
                            console.log("error: adding members to new chat...")

                            response.status(400).send({
                                message: "SQL Error",
                                error: err,
                                query: addMembersQuery
                            })
                        })
                    }).catch(err => {
                        console.log("error: inserting new chat...")

                        response.status(400).send({
                            message: "SQL Error",
                            error: err,
                            query: insertQuery
                        })
                   })            
            }
        }).catch(error => {
            console.log("error: 0 rowcount...")

            response.status(400).send({
                message: "SQL Error",
                error: error,
                query: query
            })
        });
        // if chat does not exist, create new chat

        // add all members to chat

        'SELECT * FROM chatmembers WHERE memberid IN (36, 172) AND memberid NOT IN (SELECT memberid FROM chatmembers WHERE memberid NOT IN (36, 172));'
    }
)

/**
 * @api {put} /chats/newChat Create a new chat with given members
 * @apiName New Chat
 * @apiGroup Chats
 * 
 * @apiDescription Create a new chat and insert sender and recipient members. 
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {JSONArray} members Recipient(s) of the new chat
 * 
 * @apiSuccess {boolean} success true when the name is inserted
 * 
 * @apiError (404: Chat Not Found) {String} message "chatID not found"
 * @apiError (404: Email Not Found) {String} message "email not found"
 * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. chatId must be a number" 
 * @apiError (400: Duplicate Email) {String} message "user already joined"
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
 router.put("/startChat", (request, response, next) => {
    //validate on empty parameters
    let members = [request.body.members]
    if (!request.body.members) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else if (members.length < 1) {
        response.status(400).send({
            message: "Malformed parameter. Must send at least one member"
        })
    } else {
        next()
    }
    }, (request, response, next) => {
        //validate chat id exists
        let members = [request.body.members]
        let query = 'SELECT * FROM chatmembers WHERE memberid IN ('+ members +') AND chatid NOT IN (SELECT chatid FROM chatmembers WHERE memberid NOT IN ('+ members +'))'
        console.log(query);
        // if chat containing all members exists return chat
        pool.query(query)
        .then(result => {
            console.log(result.rowCount + " : " +result.rows)
            if (result.rowCount > 0) {
                console.log("found!!")

                response.send({
                    success: 'Chat Exists',
                    chatID:result.rows[0].chatid
                })
            } else {
                console.log("creating new chat...")

                let insertQuery = `INSERT INTO Chats(Name) VALUES ('${members}') RETURNING ChatId`
                pool.query(insertQuery)
                    .then(result => {
                        console.log("inserted chat..." + result.rows[0].chatid)
                        
                        let chatid = result.rows[0].chatid
                        console.log(members + " : " + members[0][0] + "legnth" + members.le)
                        var addMembersQuery = `INSERT INTO chatmembers (ChatId, MemberId) VALUES (${chatid},${members[0][0]})`
                        for (i = 1; i < members[0].length; i++) {
                            console.log('INSIDE chatid: ' + chatid + ', memberids'+ members[0][i])
                            addMembersQuery += `, (${chatid},${members[0][i]})`
                        }

                        console.log(addMembersQuery)
                        pool.query(addMembersQuery)
                        .then(result => {
                            console.log("created chat and added members...")

                            response.send({
                                success: 'Chat created',
                                chatID:chatid
                            })
                        }).catch(err => {
                            console.log("error: adding members to new chat...")

                            response.status(400).send({
                                message: "SQL Error",
                                error: err,
                                query: addMembersQuery
                            })
                        })
                    }).catch(err => {
                        console.log("error: inserting new chat...")

                        response.status(400).send({
                            message: "SQL Error",
                            error: err,
                            query: insertQuery
                        })
                   })            
            }
        }).catch(error => {
            console.log("error: 0 rowcount...")

            response.status(400).send({
                message: "SQL Error",
                error: error,
                query: query
            })
        });
        // if chat does not exist, create new chat

        // add all members to chat

        'SELECT * FROM chatmembers WHERE memberid IN (36, 172) AND memberid NOT IN (SELECT memberid FROM chatmembers WHERE memberid NOT IN (36, 172));'
    }
)

/**
 * @apiDefine JSONError
 * @apiError (400: JSON Error) {String} message "malformed JSON in parameters"
 */ 

/**
 * @api {post} /chats Request to add a chat
 * @apiName PostChats
 * @apiGroup Chats
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * @apiParam {String} name the name for the chat
 * 
 * @apiSuccess (Success 201) {boolean} success true when the name is inserted
 * @apiSuccess (Success 201) {Number} chatId the generated chatId
 * 
 * @apiError (400: Unknown user) {String} message "unknown email address"
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiError (400: Unknown Chat ID) {String} message "invalid chat id"
 * 
 * @apiUse JSONError
 */ 
router.post("/", (request, response, next) => {
    if (!isStringProvided(request.body.name)) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        next()
    }
}, (request, response) => {

    let insert = `INSERT INTO Chats(Name)
                  VALUES ($1)
                  RETURNING ChatId`
    let values = [request.body.name]
    pool.query(insert, values)
        .then(result => {
            response.send({
                success: true,
                chatID:result.rows[0].chatid
            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })

        })
})

/**
 * @api {get} /chats/member Request to get the chats a member belongs to
 * @apiName GetChatsForUser
 * @apiGroup Chats
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 *  * 
 * @apiSuccess {Number} rowCount the number of chatrooms returned
 * @apiSuccess {Object[]} chatrooms List of chatrooms for the user
 * 
 * @apiError (404: MemberId Not Found) {String} message "Member ID Not Found"
 * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. chatId must be a number" 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
 router.get("/member", (request, response, next) => {
    //validate on missing or invalid (type) parameters
    if (!request.decoded.memberid) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else if (isNaN(request.decoded.memberid)) {
        response.status(400).send({
            message: "Malformed parameter. memberId must be a number"
        })
    } else {
        next()
    }
},  (request, response, next) => {
    //validate chat id exists
    let query = 'SELECT chatmembers.memberid, chatid, username FROM chatmembers LEFT JOIN members ON chatmembers.memberid=members.memberid WHERE chatmembers.chatid IN (SELECT chatid FROM chatmembers WHERE memberid=$1) ORDER BY chatid'
    let values = [request.decoded.memberid]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Chat ID not found"
                })
            } else {
                pool.query(query, values)
                .then(result => {
                    response.send({
                        rowCount : result.rowCount,
                        rows: result.rows
                    })
                }).catch(err => {
                    response.status(400).send({
                        message: "SQL Error",
                        error: err
                    })
                })            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        });
})


/**
 * @api {put} /chats/:chatId? Request add a user to a chat
 * @apiName PutChats
 * @apiGroup Chats
 * 
 * @apiDescription Adds the user associated with the required JWT. 
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {Number} chatId the chat to add the user to
 * 
 * @apiSuccess {boolean} success true when the name is inserted
 * 
 * @apiError (404: Chat Not Found) {String} message "chatID not found"
 * @apiError (404: Email Not Found) {String} message "email not found"
 * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. chatId must be a number" 
 * @apiError (400: Duplicate Email) {String} message "user already joined"
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.put("/:chatId/", (request, response, next) => {
    //validate on empty parameters
    if (!request.params.chatId) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else if (isNaN(request.params.chatId)) {
        response.status(400).send({
            message: "Malformed parameter. chatId must be a number"
        })
    } else {
        next()
    }
}, (request, response, next) => {
    //validate chat id exists
    let query = 'SELECT * FROM CHATS WHERE ChatId=$1'
    let values = [request.params.chatId]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Chat ID not found"
                })
            } else {
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
        //code here based on the results of the query
}, (request, response, next) => {
    //validate email exists 
    let query = 'SELECT * FROM Members WHERE MemberId=$1'
    let values = [request.decoded.memberid]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "email not found"
                })
            } else {
                //user found
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
        //validate email does not already exist in the chat
        let query = 'SELECT * FROM ChatMembers WHERE ChatId=$1 AND MemberId=$2'
        let values = [request.params.chatId, request.decoded.memberid]
    
        pool.query(query, values)
            .then(result => {
                if (result.rowCount > 0) {
                    response.status(400).send({
                        message: "user already joined"
                    })
                } else {
                    next()
                }
            }).catch(error => {
                response.status(400).send({
                    message: "SQL Error",
                    error: error
                })
            })

}, (request, response) => {
    //Insert the memberId into the chat
    let insert = `INSERT INTO ChatMembers(ChatId, MemberId)
                  VALUES ($1, $2)
                  RETURNING *`
    let values = [request.params.chatId, request.decoded.memberid]
    pool.query(insert, values)
        .then(result => {
            response.send({
                success: true
            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
    }
)

/**
 * @api {get} /chats/:chatId? Request to get the emails of user in a chat
 * @apiName GetChats
 * @apiGroup Chats
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {Number} chatId the chat to look up. 
 * 
 * @apiSuccess {Number} rowCount the number of messages returned
 * @apiSuccess {Object[]} members List of members in the chat
 * @apiSuccess {String} messages.email The email for the member in the chat
 * 
 * @apiError (404: ChatId Not Found) {String} message "Chat ID Not Found"
 * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. chatId must be a number" 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.get("/:chatId", (request, response, next) => {
    //validate on missing or invalid (type) parameters
    if (!request.params.chatId) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else if (isNaN(request.params.chatId)) {
        response.status(400).send({
            message: "Malformed parameter. chatId must be a number"
        })
    } else {
        next()
    }
},  (request, response, next) => {
    //validate chat id exists
    let query = 'SELECT * FROM CHATS WHERE ChatId=$1'
    let values = [request.params.chatId]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Chat ID not found"
                })
            } else {
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
    }, (request, response) => {
        //Retrieve the members
        let query = `SELECT Members.Email 
                    FROM ChatMembers
                    INNER JOIN Members ON ChatMembers.MemberId=Members.MemberId
                    WHERE ChatId=$1`
        let values = [request.params.chatId]
        pool.query(query, values)
            .then(result => {
                response.send({
                    rowCount : result.rowCount,
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
 * @api {delete} /chats/:chatId?/:email? Request delete a user from a chat
 * @apiName DeleteChats
 * @apiGroup Chats
 * 
 * @apiDescription Does not delete the user associated with the required JWT but 
 * instead deletes the user based on the email parameter.  
 * 
 * @apiParam {Number} chatId the chat to delete the user from
 * @apiParam {String} email the email of the user to delete
 * 
 * @apiSuccess {boolean} success true when the name is deleted
 * 
 * @apiError (404: Chat Not Found) {String} message "chatID not found"
 * @apiError (404: Email Not Found) {String} message "email not found"
 * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. chatId must be a number" 
 * @apiError (400: Duplicate Email) {String} message "user not in chat"
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.delete("/:chatId/:email", (request, response, next) => {
    //validate on empty parameters
    if (!request.params.chatId || !request.params.email) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else if (isNaN(request.params.chatId)) {
        response.status(400).send({
            message: "Malformed parameter. chatId must be a number"
        })
    } else {
        next()
    }
}, (request, response, next) => {
    //validate chat id exists
    let query = 'SELECT * FROM CHATS WHERE ChatId=$1'
    let values = [request.params.chatId]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Chat ID not found"
                })
            } else {
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    //validate email exists AND convert it to the associated memberId
    let query = 'SELECT MemberID FROM Members WHERE Email=$1'
    let values = [request.params.email]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "email not found"
                })
            } else {
                request.params.email = result.rows[0].memberid
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
        //validate email exists in the chat
        let query = 'SELECT * FROM ChatMembers WHERE ChatId=$1 AND MemberId=$2'
        let values = [request.params.chatId, request.params.email]
    
        pool.query(query, values)
            .then(result => {
                if (result.rowCount > 0) {
                    next()
                } else {
                    response.status(400).send({
                        message: "user not in chat"
                    })
                }
            }).catch(error => {
                response.status(400).send({
                    message: "SQL Error",
                    error: error
                })
            })

}, (request, response) => {
    //Delete the memberId from the chat
    let insert = `DELETE FROM ChatMembers
                  WHERE ChatId=$1
                  AND MemberId=$2
                  RETURNING *`
    let values = [request.params.chatId, request.params.email]
    pool.query(insert, values)
        .then(result => {
            response.send({
                success: true
            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
    }
)





module.exports = router