const geoLocation = require('./geoLocation/geoLocation');
const weather = require('./weather/weather');

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

var app = express();

var port = process.env.PORT || 800;
//middleware
app.use((req,res,next) => {
    var currentDate = new Date().toString();
    var log = `${currentDate} ${req.method} ${req.ip} ${req.url} \n`;
    fs.appendFileSync('Server.log', log);
    next();
}); 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/getweather', (req,res) =>{
    var returnJson = {};
    var strAddress = '';
    if(req.method == 'GET')
        strAddress = req.query.address;
    geoLocation.geocodeAddress(strAddress, (strMessage, geocode) =>{
        if(strMessage){
            res.json({ message : strMessage});
        } else {
            weather.getWeather(geocode.latitude, geocode.longitude, (strErrorMessage, weatherData) => {
                if (strErrorMessage){
                    res.json({ message: strErrorMessage });
                } else {
                    res.json({
                        message : "OK",
                        response: weatherData
                    });
                }
            });
        }
    }); 
});

app.post('/getweather', (req, res) => {
    var strAddress = '';
    if (req.method == 'POST')
        strAddress = req.body.address;
    geoLocation.geocodeAddress(strAddress, (strMessage, geocode) => {
        if (strMessage) {
            res.json({ message: strMessage });
        } else {
            weather.getWeather(geocode.latitude, geocode.longitude, (strErrorMessage, weatherData) => {
                if (strErrorMessage) {
                    res.json({ message: strErrorMessage });
                } else {
                    res.json({
                        message: "OK",
                        response: weatherData
                    });
                }
            });
        }
    });
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})