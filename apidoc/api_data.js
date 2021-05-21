define({ "api": [
  {
    "type": "delete",
    "url": "/auth",
    "title": "Request to delete a Pushy Token for the user",
    "name": "DeleteAuth",
    "group": "Auth",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the pushy token is deleted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "404: User Not Found": [
          {
            "group": "404: User Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;user not found&quot;</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/pushyregister.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/auth",
    "title": "Request to sign a user in the system",
    "name": "GetAuth",
    "group": "Auth",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>&quot;username:password&quot; uses Basic Auth</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the name is found and password matches</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Authentication successful!&quot;&quot;</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>JSON Web Token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 OK\n{\n  \"success\": true,\n  \"message\": \"Authentication successful!\",\n  \"token\": \"eyJhbGciO...abc123\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400: Missing Authorization Header": [
          {
            "group": "400: Missing Authorization Header",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing Authorization Header&quot;</p>"
          }
        ],
        "400: Malformed Authorization Header": [
          {
            "group": "400: Malformed Authorization Header",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Malformed Authorization Header&quot;</p>"
          }
        ],
        "404: User Not Found": [
          {
            "group": "404: User Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;User not found&quot;</p>"
          }
        ],
        "400: Invalid Credentials": [
          {
            "group": "400: Invalid Credentials",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Credentials did not match&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/signin.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth",
    "title": "Request to register a user",
    "name": "PostAuth",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "first",
            "description": "<p>a users first name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "last",
            "description": "<p>a users last name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>a users email *unique</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>a users password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "username",
            "description": "<p>a username *unique, if none provided, email will be used</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Body-Example:",
          "content": "{\n    \"first\":\"FirstName\",\n    \"last\":\"LastName\",\n    \"email\":\"test@fake.email\",\n    \"password\":\"test12345\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the name is inserted</p>"
          },
          {
            "group": "Success 201",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>the email of the user inserted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: Username exists": [
          {
            "group": "400: Username exists",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Username exists&quot;</p>"
          }
        ],
        "400: Email exists": [
          {
            "group": "400: Email exists",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Email exists&quot;</p>"
          }
        ],
        "400: Other Error": [
          {
            "group": "400: Other Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;other error, see detail&quot;</p>"
          },
          {
            "group": "400: Other Error",
            "type": "String",
            "optional": false,
            "field": "detail",
            "description": "<p>Information about the error</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/register.js",
    "groupTitle": "Auth"
  },
  {
    "type": "put",
    "url": "/auth",
    "title": "Request to insert a Pushy Token for the user",
    "name": "PutAuth",
    "group": "Auth",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>the Pushy Token of the user identified in the JWT</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the pushy token is inserted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "404: User Not Found": [
          {
            "group": "404: User Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;user not found&quot;</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/pushyregister.js",
    "groupTitle": "Auth"
  },
  {
    "type": "delete",
    "url": "/chats/:chatId?/:email?",
    "title": "Request delete a user from a chat",
    "name": "DeleteChats",
    "group": "Chats",
    "description": "<p>Does not delete the user associated with the required JWT but instead deletes the user based on the email parameter.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "chatId",
            "description": "<p>the chat to delete the user from</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>the email of the user to delete</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the name is deleted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404: Chat Not Found": [
          {
            "group": "404: Chat Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;chatID not found&quot;</p>"
          }
        ],
        "404: Email Not Found": [
          {
            "group": "404: Email Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;email not found&quot;</p>"
          }
        ],
        "400: Invalid Parameter": [
          {
            "group": "400: Invalid Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Malformed parameter. chatId must be a number&quot;</p>"
          }
        ],
        "400: Duplicate Email": [
          {
            "group": "400: Duplicate Email",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;user not in chat&quot;</p>"
          }
        ],
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/chats.js",
    "groupTitle": "Chats"
  },
  {
    "type": "get",
    "url": "/chats/:chatId?",
    "title": "Request to get the emails of user in a chat",
    "name": "GetChats",
    "group": "Chats",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "chatId",
            "description": "<p>the chat to look up.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "rowCount",
            "description": "<p>the number of messages returned</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "members",
            "description": "<p>List of members in the chat</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "messages.email",
            "description": "<p>The email for the member in the chat</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404: ChatId Not Found": [
          {
            "group": "404: ChatId Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Chat ID Not Found&quot;</p>"
          }
        ],
        "400: Invalid Parameter": [
          {
            "group": "400: Invalid Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Malformed parameter. chatId must be a number&quot;</p>"
          }
        ],
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/chats.js",
    "groupTitle": "Chats"
  },
  {
    "type": "get",
    "url": "/chats/member",
    "title": "Request to get the chats a member belongs to",
    "name": "GetChatsForUser",
    "group": "Chats",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT *</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "rowCount",
            "description": "<p>the number of chatrooms returned</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "chatrooms",
            "description": "<p>List of chatrooms for the user</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404: MemberId Not Found": [
          {
            "group": "404: MemberId Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Member ID Not Found&quot;</p>"
          }
        ],
        "400: Invalid Parameter": [
          {
            "group": "400: Invalid Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Malformed parameter. chatId must be a number&quot;</p>"
          }
        ],
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/chats.js",
    "groupTitle": "Chats"
  },
  {
    "type": "post",
    "url": "/chats",
    "title": "Request to add a chat",
    "name": "PostChats",
    "group": "Chats",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the name for the chat</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the name is inserted</p>"
          },
          {
            "group": "Success 201",
            "type": "Number",
            "optional": false,
            "field": "chatId",
            "description": "<p>the generated chatId</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Unknown user": [
          {
            "group": "400: Unknown user",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;unknown email address&quot;</p>"
          }
        ],
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "400: Unknown Chat ID": [
          {
            "group": "400: Unknown Chat ID",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;invalid chat id&quot;</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/chats.js",
    "groupTitle": "Chats"
  },
  {
    "type": "put",
    "url": "/chats/:chatId?",
    "title": "Request add a user to a chat",
    "name": "PutChats",
    "group": "Chats",
    "description": "<p>Adds the user associated with the required JWT.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "chatId",
            "description": "<p>the chat to add the user to</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the name is inserted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404: Chat Not Found": [
          {
            "group": "404: Chat Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;chatID not found&quot;</p>"
          }
        ],
        "404: Email Not Found": [
          {
            "group": "404: Email Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;email not found&quot;</p>"
          }
        ],
        "400: Invalid Parameter": [
          {
            "group": "400: Invalid Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Malformed parameter. chatId must be a number&quot;</p>"
          }
        ],
        "400: Duplicate Email": [
          {
            "group": "400: Duplicate Email",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;user already joined&quot;</p>"
          }
        ],
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/chats.js",
    "groupTitle": "Chats"
  },
  {
    "type": "post",
    "url": "/contacts/create",
    "title": "Add a contact to the current member",
    "name": "Create_Contact",
    "group": "Contacts",
    "description": "<p>Given two memberid's, add the two members as contacts</p>",
    "version": "0.0.0",
    "filename": "routes/contacts.js",
    "groupTitle": "Contacts"
  },
  {
    "type": "delete",
    "url": "/contacts/delete",
    "title": "Delete a contact from the current member's contacts list",
    "name": "Delete_Contact",
    "group": "Contacts",
    "description": "<p>Given two memberid's, remove the two members as contacts</p>",
    "version": "0.0.0",
    "filename": "routes/contacts.js",
    "groupTitle": "Contacts"
  },
  {
    "type": "get",
    "url": "/contacts/:memberId",
    "title": "Get contacts for a given memberid",
    "name": "GetContacts",
    "group": "Contacts",
    "description": "<p>Requests all of the usernames of the contacts for a member</p>",
    "version": "0.0.0",
    "filename": "routes/contacts.js",
    "groupTitle": "Contacts"
  },
  {
    "type": "Post",
    "url": "/forgot?name=params",
    "title": "Request to reset a forgot password",
    "name": "PostForgot",
    "group": "Forgot",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>a user email</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>confirming email sent</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Email not found": [
          {
            "group": "400: Email not found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Email not found&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/forgot.js",
    "groupTitle": "Forgot"
  },
  {
    "type": "get",
    "url": "/messages/:chatId?/:messageId?",
    "title": "Request to get chat messages",
    "name": "GetMessages",
    "group": "Messages",
    "description": "<p>Request to get the 10 most recent chat messages from the server in a given chat - chatId. If an optional messageId is provided, return the 10 messages in the chat prior to (and not including) the message containing MessageID.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "chatId",
            "description": "<p>the chat to look up.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "messageId",
            "description": "<p>(Optional) return the 15 messages prior to this message</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "rowCount",
            "description": "<p>the number of messages returned</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "messages",
            "description": "<p>List of massages in the message table</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "messages.messageId",
            "description": "<p>The id for this message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "messages.email",
            "description": "<p>The email of the user who posted this message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "messages.message",
            "description": "<p>The message text</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "messages.timestamp",
            "description": "<p>The timestamp of when this message was posted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404: ChatId Not Found": [
          {
            "group": "404: ChatId Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Chat ID Not Found&quot;</p>"
          }
        ],
        "400: Invalid Parameter": [
          {
            "group": "400: Invalid Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Malformed parameter. chatId must be a number&quot;</p>"
          }
        ],
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/messages.js",
    "groupTitle": "Messages"
  },
  {
    "type": "post",
    "url": "/messages",
    "title": "Request to add a message to a specific chat",
    "name": "PostMessages",
    "group": "Messages",
    "description": "<p>Adds the message from the user associated with the required JWT.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Valid JSON Web Token JWT</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "chatId",
            "description": "<p>the id of th chat to insert this message into</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>a message to store</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when the name is inserted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Unknown user": [
          {
            "group": "400: Unknown user",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;unknown email address&quot;</p>"
          }
        ],
        "400: Missing Parameters": [
          {
            "group": "400: Missing Parameters",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Missing required information&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ],
        "400: Unknown Chat ID": [
          {
            "group": "400: Unknown Chat ID",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;invalid chat id&quot;</p>"
          }
        ],
        "400: JSON Error": [
          {
            "group": "400: JSON Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;malformed JSON in parameters&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/messages.js",
    "groupTitle": "Messages"
  },
  {
    "type": "get",
    "url": "/weather Request a JSONObject which should bring the",
    "title": "weather data for a desired location",
    "name": "OneCallApi",
    "group": "OpenWeatherMap",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>JWT provided from Auth get</p>"
          }
        ]
      }
    },
    "description": "<p>This endpoint is a pass through to the OpenWeatherMap.org API. All parameters will pass on to the https://api.openweathermap.org/data/2.5/onecall? . See the <a href=\"https://openweathermap.org/api/one-call-api\">OpenWeatherMap.org documentation</a> for additional parameters and additional information. An API key is required in order to make calls with this endpoint.</p>",
    "version": "0.0.0",
    "filename": "routes/weather.js",
    "groupTitle": "OpenWeatherMap"
  },
  {
    "type": "get",
    "url": "/reset",
    "title": "HTML page that user can reset their password",
    "name": "GetReset",
    "group": "Reset",
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "HTML",
            "optional": false,
            "field": "path",
            "description": "<p>Redirects to the reset page</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404: Not Found": [
          {
            "group": "404: Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;No such path exists&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/reset.js",
    "groupTitle": "Reset"
  },
  {
    "type": "post",
    "url": "/changePassword",
    "title": "Request to change a password",
    "name": "PostChangePassword",
    "group": "Reset",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>token that contain email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "oldPW",
            "description": "<p>the current password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newPW",
            "description": "<p>the new password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "confirmPW",
            "description": "<p>the confirm new password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when password is updated</p>"
          },
          {
            "group": "Success 201",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Your Password has been changed&quot;</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Bad Token": [
          {
            "group": "400: Bad Token",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Token expired or invalid&quot;</p>"
          }
        ],
        "400: Bad Request": [
          {
            "group": "400: Bad Request",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Invalid request&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/changePassword.js",
    "groupTitle": "Reset"
  },
  {
    "type": "post",
    "url": "/reset",
    "title": "Request to reset a password",
    "name": "PostReset",
    "group": "Reset",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>token that contain email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>the new password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "confirm",
            "description": "<p>the confirm password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true when password is updated</p>"
          },
          {
            "group": "Success 201",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Password updated!&quot;</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Bad Token": [
          {
            "group": "400: Bad Token",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Token expired or invalid&quot;</p>"
          }
        ],
        "400: Bad Request": [
          {
            "group": "400: Bad Request",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Invalid request&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/reset.js",
    "groupTitle": "Reset"
  },
  {
    "type": "get",
    "url": "/support",
    "title": "Request for support",
    "name": "GetSupport",
    "group": "Support",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mode",
            "description": "<p>Type of support page</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>JWT token containing name data</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "HTML",
            "optional": false,
            "field": "path",
            "description": "<p>Redirects to appropriate support page</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404: Not Found": [
          {
            "group": "404: Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;No such path exists&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/support.js",
    "groupTitle": "Support"
  },
  {
    "type": "get",
    "url": "/success",
    "title": "Success HTML splash after the email is verified",
    "name": "GetVerify",
    "group": "Verify",
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "HTML",
            "optional": false,
            "field": "path",
            "description": "<p>Redirects to the Success page</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404: Not Found": [
          {
            "group": "404: Not Found",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;No such path exists&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/verify.js",
    "groupTitle": "Verify"
  },
  {
    "type": "Post",
    "url": "/verify?name=params",
    "title": "Request to update verification status",
    "name": "PostVerify",
    "group": "Verify",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>from email</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>confirming verification success</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400: Unable to verify email": [
          {
            "group": "400: Unable to verify email",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Email is already verified&quot;</p>"
          }
        ],
        "400: Invalid verification link": [
          {
            "group": "400: Invalid verification link",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Invalid link&quot;</p>"
          }
        ],
        "400: SQL Error": [
          {
            "group": "400: SQL Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>the reported SQL error details</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/verify.js",
    "groupTitle": "Verify"
  }
] });
