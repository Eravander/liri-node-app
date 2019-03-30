require("dotenv").config();

var axios = require("axios");
var Spotify = require("node-spotify-api")
var fs = require("fs");
var keys = require("./keys.js");
var moment = require('moment');

var spotify = new Spotify(keys.spotify);

var command = process.argv[2].toLowerCase();
//Determine which function to call
switch (command) {
  case "concert-this":
    var artist = process.argv.splice(3).join(" ")
    concertThis(artist);
    console.log("Finding Concerts")
    break;
  case "spotify-this-song":
    console.log("You want to search spotify for this song info")
    break;
  case "movie-this":
    console.log("You want to search for this movie")
    break;
  case "do-what-it-says":
    console.log("You want to do what the txt file says")
    break;
  default:
    console.log("Enter one of these commands: concert-this, spotify-this-song, movie-this, do-what-it-says")
}
//Search for concerts
function concertThis(band){
  var URL = `https://rest.bandsintown.com/artists/${band}/events?app_id=codingbootcamp`
  
  axios.get(URL).then(function(response) {
    var results = response.data

    results.forEach(function(show){
      var info = `Venue Name: ${show.venue.name}
Venue Location: ${show.venue.city}, ${show.venue.region}
Date of event: ${moment(show.datetime).format("MM/DD/YYYY")}
------------------------------------------------------------
`
      fs.appendFileSync("log.txt",`Concert Information:
${info}`, function(err) {
        if (err) throw err;
      })
      console.log(info)
    })
  })
};
