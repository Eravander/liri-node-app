require("dotenv").config();
//Requirements
var axios = require("axios");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var keys = require("./keys.js");
var moment = require('moment');
//Spotify BS
var spotify = new Spotify(keys.spotify);
//global variables
var lookup = ""
var command = process.argv[2].toLowerCase();

//Function to run program, allows random.txt file to run with its pre-written parameters.
validate(command, lookup);
//Determine which function to call
  function validate(command, lookup) {
    switch (command) {
      case "concert-this":
        var artist = process.argv.splice(3).join(" ") || "Korn" || lookup
        concertThis(artist);
        console.log(`Finding ${artist} concerts`)
        break;

      case "spotify-this-song":
        var title = process.argv.splice(3).join(" ") || lookup || "The Sign"
        spotifyThis(title);
        console.log(`You want to search Spotify for ${title}`)
        break;

      case "movie-this":
        var movie = process.argv.splice(3).join(" ") || lookup || "Mr. Nobody";
        movieThis(movie);
        console.log(`You want to search for ${movie}`)
        break;

      case "do-what-it-says":
        randomTxt();
        console.log("You want to do what the txt file says")
        break;
        
      default:
        console.log("Enter one of these commands: concert-this, spotify-this-song, movie-this, do-what-it-says")
    }
}
//Search for concerts
function concertThis(band) {
  var URL = `https://rest.bandsintown.com/artists/${band}/events?app_id=codingbootcamp`

  axios.get(URL).then(function (response) {
    var results = response.data

    results.forEach(function (show) {
      var info = `----------------------------------------
Venue Name: ${show.venue.name}
Venue Location: ${show.venue.city}, ${show.venue.region}
Date of event: ${moment(show.datetime).format("MM/DD/YYYY")}
------------------------------------------------------------
`
      fs.appendFileSync("log.txt", `Concert Information
${info}`, function (err) {
          if (err) throw err;
        })
      console.log(info)
    })
  })
};

function spotifyThis(track) {
  var song = track || "The Sign"
  spotify
    .search({ type: 'track', query: song })
    .then(function (response) {
      // console.log(response.tracks.items[0])
     var results = response.tracks.items[0];
    info = `--------------------------------------
Artist: ${results.artists[0].name}
Song Title: ${results.name}
Preview Link: ${results.preview_url}
Album: ${results.album.name}
------------------------------------------------`
fs.appendFileSync("log.txt", `Song Information
    ${info}`, function (err) {
          if (err) throw err;
        });
console.log(info)
    })
    .catch(function (err) {
      console.log(err);
    });
}

function movieThis(movie) {
  var URL = `http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=trilogy`
  axios.get(URL).then(
    function (response) {
      results = response.data;
      var info = `------------------------------
Title: ${results.Title}
Year: ${results.Year}
IMDB Rating: ${results.Ratings[0].Value}
Rotten Tomatoes Rating: ${results.Ratings[1].Value}
Country: ${results.Country}
Languages: ${results.Language}
Actors: ${results.Actors}
Plot" ${results.Plot}
--------------------------------------------`

      fs.appendFileSync("log.txt", `Movie Information
    ${info}`, function (err) {
          if (err) throw err;
        });
      console.log(info);
    }
  );
}

function randomTxt() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",")

    command = dataArr[0];
    lookup = dataArr[1];

    validate(command, lookup);
  })
}