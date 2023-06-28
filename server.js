import express from 'express';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
    const city = req.body.cityName;

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=f590599f0c726ee60e89b4146d0cdaab&units=metric";

    https.get(url, (response) => {
        console.log(response.statusCode);

        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const temprature = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const humidity = weatherData.main.humidity;
            const pressure = weatherData.main.pressure;

            const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            // console.log(temprature);
            // console.log(description);
            // console.log(city);

            res.send("<h2>The temprature at " + city + " is " + temprature + " degree celcius.</h2>" + "<p>The weather is currently " + description + ".</p>" + "<img src=" + imageUrl + ">" + "<p>Humidity is: " + humidity + ".</p>" + "<p>Air Pressure is: " + pressure + ".</p>");
        });
    });
});

app.listen(port, () => {
    console.log("The server running at port no: " + port);
});