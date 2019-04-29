require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const axios = require("axios")
const spotify = new Spotify(keys.spotify);
const fs = require("fs")
const moment = require("moment")

//taken in user input
const command = process.argv[2];
let input = process.argv.splice(3).join("+")

//switch statements for commands
switch (command) {
    case "concert-this":
        concertThis()
        break;
    case "spotify-this":
        spotifyThis();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
};

function concertThis() {
    axios
        .get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
        .then(function (response) {
            const concertArr = response.data

            for (let i = 0; i < concertArr.length; i++) {
                console.log(`============================`)
                console.log(`Venue: ${concertArr[i].venue.name}`);
                console.log(`Location: ${concertArr[i].venue.city}`);
                console.log(`Date: ${concertArr[i].datetime}`);
                console.log(`============================`)

            }

        })

}


function spotifyThis() {
    spotify.search({
        type: 'track',
        query: input
    }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        // Do something with 'data'

        const response = data.tracks.items
        for (let i = 0; i < response.length; i++) {
            console.log(`
            Artist Name: ${response[i].artists[0].name}
            Song: ${response[i].name}
            URL: ${response[i].external_urls.spotify}
            Album name: ${response[i].album.name}

            `)
        }
    });
}

function movieThis() {

    axios.get("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            const movieData = response.data;

            console.log(movieData);

            console.log(movieData.Title);
            console.log(movieData.Plot);
            console.log(`Movie Title: ${movieData.Title}
            Year Movie Came Out: ${movieData.Released} 
            IMBD Rating of Movie: ${movieData.imdbRating}
            Rotten Tomatoes Rating: ${movieData.Ratings[1].Value}
            Country Movie Produced:${movieData.Country}
            Lang Movie: ${movieData.Language}
            Plot Of Movie: ${movieData.Plot}
            Actors In Movie: ${movieData.Actors} `)

        }
    );

}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error)
        }
        // spotify-this, "I want it that way" => ["spotify-this", "I want it that way"]
        const dataArr = data.split(",");

        // command = "spotify-this"
        const command = dataArr[0]
        // input = "I want it that way"
        input = dataArr[1]

        switch (command) {
            case "concert-this":
                concertThis()
                break;
            case "spotify-this":
                spotifyThis();
                break;
            case "movie-this":
                movieThis();
                break;
        };

    })
}