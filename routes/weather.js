const API_KEY = process.env.OPENWEATHERMAPS_DOT_ORG_KEY

//express is the framework we're going to use to handle requests
const express = require('express')

//request module is needed to make a request to a web service
const request = require('request')

var router = express.Router()

/**
 * @api {get} /weather Request a JSONObject which should bring the 
 * weather data for a desired location
 * @apiName OneCallApi
 * @apiGroup OpenWeatherMap
 * 
 * @apiHeader {String} authorization JWT provided from Auth get
 * 
 * @apiDescription This endpoint is a pass through to the OpenWeatherMap.org API. All parameters will
 * pass on to the https://api.openweathermap.org/data/2.5/onecall? . 
 * See the <a href="https://openweathermap.org/api/one-call-api">OpenWeatherMap.org documentation</a> 
 * for additional parameters and additional information. An API key is required in order to
 * make calls with this endpoint. 
 */ 
router.get("/", (req, res) => {

    //An example of the call made using the One Call API.
    //https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
    //let url = `https://api.openweathermap.org/data/2.5/onecall?&appid={API_KEY}`
    

    //Retrieve data from query params
    const lon = request.body.lon
    const lat = request.body.lat
    const exclude = request.body.exclude
    const units = request.body.units

    //Needs checking for correctness and whether this string, while not a string literal, is fine.
    let url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=" + exclude + "&units=" + units +"&appid=" + API_KEY

    /*What this code above is doing is that it is taking the URL from the WeatherViewModel and then extracting the 
    parameters that were sent along for the ride. */

    //When this web service gets a request, make a request to the OpenWeatherMap Web service
    request(url, function (error, response, body) {
        if (error) {
            res.send(error)
        } else {
            // pass on everything (try out each of these in Postman to see the difference)
            // res.send(response);
            
            // or just pass on the body

            var n = body.indexOf("{")
            var nakidBody = body.substring(n - 1)

            res.send(nakidBody)
        }
    })

})

module.exports = router