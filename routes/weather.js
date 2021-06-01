//The Weather API key for connection to the openweathermaps API
const API_KEY = process.env.OPENWEATHERMAPS_DOT_ORG_KEY

//The GOOGLE API key for connection to the geocode API
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

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
    res.type("application/json");
    if (req.query.zip && req.query.zip.length === 5) {
        zipcode = req.query.zip;
        let googleUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=zipcode" + zipcode + "&key=" +
            process.env.GOOGLE_API_KEY;
        request(googleUrl, function(error, response, body) {
            if (error) {
                res.send(error);
            } else {
                let googleGeo = JSON.parse(body);
                let latitude = googleGeo.results[0].geometry.location.lat;
                let longitude = googleGeo.results[0].geometry.location.lng;
                let locationInfo = googleGeo.results[0].address_components;
                let cityName = "Unknown";
                for (let i = 0; i < locationInfo.length; i++) {
                    if (locationInfo[i].types.includes("locality") ||
                        locationInfo[i].types.includes("sublocality") ||
                        locationInfo[i].types.includes("sublocality_level_1")) {
                        cityName = locationInfo[i].short_name;
                        break;
                    }
                }
                let url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude +
                    "&exclude=minutely, alerts&units=imperial&appid=" + API_KEY;
                
                request(url, function (error, response, body) {
                    if (error) {
                        res.send(error);
                    } else {
                        let tempBody = JSON.parse(body) 
                        var n = body.indexOf("{")
                        var nakidBody = body.substring(n - 1)
                        res.status(200).send({
                            location: {
                                zip: zipcode,
                                city: cityName,
                                latitude: latitude,
                                longitude: longitude
                            },
                            weatherData: tempBody
                        })
                    }
                });
            }
        });
    } else if (req.query.latitude && req.query.longitude) {
        let coords = req.query.latitude + "," + req.query.longitude;
        let latitude = req.query.latitude;
        let longitude = req.query.longitude;
        let googleUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + coords + "&key=" +
            process.env.GOOGLE_API_KEY;
        request(googleUrl, function (error, response, body) {
            if (error) {
                res.send(error);
            } else {
                let zip = "N/A";
                let cityName = "Unknown";
                let locationInfo = JSON.parse(body).results[0].address_components;
                for (let i = 0; i < locationInfo.length; i++) {
                    if (locationInfo[i].types.includes("locality") ||
                        locationInfo[i].types.includes("sublocality") ||
                        locationInfo[i].types.includes("sublocality_level_1")) {
                        cityName = locationInfo[i].short_name;
                    }
                    if (locationInfo[i].types.includes("postal_code")) {
                        zip = locationInfo[i].short_name;
                    }
                }
                let url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude +
                    "&exclude=minutely, alerts&units=imperial&appid=" + API_KEY;
                request(url, function (error, response, body) {
                    if (error) {
                        res.send(error);
                    } else {
                        let tempBody = JSON.parse(body);
                        var n = body.indexOf("{")
                        var nakidBody = body.substring(n - 1)
                        res.status(200).send({
                            location: {
                                zip: zip,
                                city: cityName,
                                latitude: latitude,
                                longitude: longitude
                            },
                            weatherData: tempBody
                        });
                    }
                });
            }
        });
    } else {
        res.status(400).send({
            message: "Missing required location info!"
        });
    }
});

module.exports = router