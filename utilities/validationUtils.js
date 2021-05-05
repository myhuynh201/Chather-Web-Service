//const { param } = require("../routes/signin")

/**
 * Checks the parameter to see if it is a a String with a length greater than 0.
 * 
 * @param {string} param the value to check
 * @returns true if the parameter is a String with a length greater than 0, false otherwise
 */
let isStringProvided = (param) => 
    param !== undefined && param.length > 0


/**
 * Checks the parameter to see if it is a valid email address.
 * 
 * @param {string} email the value to check
 * @returns true if the parameter is a valid email address, false otherwise
 */
function isValidEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Checks the parameter to see if it is a valid password with at least 7 characters, 
 * 1 uppercase, 1 lowercase and 1 special character
 * 
 * @param {string} password the value to check
 * @returns true if the parameter is a valid password, false otherwise
 */
    
function isValidPassword(password){
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/.test(password)
}
  
module.exports = { 
  isStringProvided, isValidEmail, isValidPassword
}
