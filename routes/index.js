
/*
 * routes/index.js
 * 
 * Routes contains the functions (callbacks) associated with request urls.
 */

var request = require('request'); // library to make requests to remote urls
var moment = require("moment"); // date manipulation library

//Carto Db
var CartoDB = require('cartodb');
var secret = require('./secret.js');
var client = new CartoDB({user:secret.USER, api_key:secret.API_KEY});

//var astronautModel = require("../models/astronaut.js"); //db model



/*
	GET /
*/
exports.index = function(req, res) {

	console.log("main page requested");

	res.render("home.html");
}
exports.cartoGet = function(req, res){
	
	res.send('<form method="POST" action="/carto">' +
					'Lat: <input type="text" name="form_lat" />' +					
					'Lon: <input type="text" name="form_lon" />' +
					'Body: <input type="text" name="form_body" />' +					
					'<input type="submit" />' +
					'</form>');	
}
exports.cartoPost = function(req, res) {

	//+1 646-461-2530
		
	// get the body of the text message
	var body = req.body.Body;
	var splitArray = body.split(",")
	var lat = splitArray[0];
	var lon = splitArray[1];
	var from = req.body.From;
	var map = 'multi_phone_track_test';
 
	console.log(lat + " , " + lon);
	console.log("From: " + from);

	// use the form to post lat/lon coordinates - NOTE: CartoDB recieves them as lon/lat	
	var location = '{"type":"Point","coordinates":['+lon+','+lat+']}';

	// send geojson values
	client.query('INSERT INTO' + map + ' (the_geom, number) VALUES (ST_SetSRID(ST_GeomFromGeoJSON(\'' + location + '\'), 4326),\'' + from + '\');'); 

	// catch any errors from cartodb
	client.on('error', function(err) {
	    console.log("some error ocurred from CartoDB");
	    //console.log(err);
	});

	res.send('received post from twilio');
	
};
