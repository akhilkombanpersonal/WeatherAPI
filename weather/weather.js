const request = require("request");

var getWeather = (lat, log, callback) => {
    request({
        url: `https://api.darksky.net/forecast/92fc2a9ff868976856c97d16b1dd1aa1/${lat},${log}`,
        json: true,
    }, (error, response, body) => {
        if (error) {
            callback(`Unable to connect with forecast.io`);
        }
        else if (response.statusCode == 400) {
            callback('Unable to fetch weather');
        }
        else if (!error && response.statusCode == 200) {
            callback(undefined, body);
            //     {
            //     temperature: body.currently.temperature,
            //     appTemperature: body.currently.apparentTemperature,
            // }
        }
        else {
            callback('Unable to fetch weather');
        }
    });
}

module.exports.getWeather = getWeather;