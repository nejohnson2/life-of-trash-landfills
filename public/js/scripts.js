var map;
var chicago = new google.maps.LatLng(41.850033, -87.6500523);

jQuery(document).ready(function() {
	initialize();
	getTopTen();

});

function initialize() {

	$.getJSON('epa_echo_full_final.json', function(data) {
	    
	    $.each(data, function(key, value){
		    if(value.LRTLat != ""){
		    
			    var tmpLatLng = new google.maps.LatLng(value.LRTLat, value.LRTLon);
			    var markerIconFive = "img/markerIconFive.png";
			    var markerIconZero = "img/markerIconZero.png";				    

				var marker = new google.maps.Marker({
				    map: map,
				    position: tmpLatLng,
				    icon: markerIconZero
				});											
						
				var infowindow =  new google.maps.InfoWindow({
				    content: ''
				});
				
				var contentInfo = '<div id="content">'+
					'<h3>' + value.Facility_Name + '</h3>' + 
					'<div>' + value.Facility_Street + " " + value.Facility_City + ", " + value.Facility_State + ", " + value.Facility_ZIP_Code + '</div>' +
					'<ul><li>Days since last inspection : ' + value.DaysSinceLastInspection + '</li>' +

					'<li> Alleged significat violations : ' + value.AllegedCurrentSignificantViolations + '</li>' +

					'<a href="/home">View Site</a>' + 
					'</ul>'						
				bindInfoWindow(marker, map, infowindow, contentInfo);
				
		    } 
	    });		    		    
	});


	// Get LatLng for users via browser
	if (google.loader.ClientLocation){
		var latlng = new google.maps.LatLng(google.loader.ClientLocation.latitude, google.loader.ClientLocation.longitude);
	} else {
		var latlng = new google.maps.LatLng(41.850033, -87.6500523); //chicago 
	}
	
	var mapOptions = {
	  center: latlng,
	  zoom: 12,
	  mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	
	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	
	//display location in html
	//document.getElementById("location").innerHTML = location; 
	
} //end initaile function

// binds a map marker and infoWindow together on click
var bindInfoWindow = function(marker, map, infowindow, html) {
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(html);
        infowindow.open(map, marker);	    
    });
}

/* google.maps.event.addDomListener(window, 'load', initialize); */

function getTopTen(){

	// Get LatLng for users via browser
	if (google.loader.ClientLocation){
		var latlng = new google.maps.LatLng(google.loader.ClientLocation.latitude, google.loader.ClientLocation.longitude);
	} else {
		var latlng = new google.maps.LatLng(41.850033, -87.6500523); //chicago 
	}


	/* FIX BUG
		 toString adds in parenthasis which cause problems while caluclating!!!! 
	*/

	var currentPos = latlng.toString();
	currentPos = currentPos.replace("(","");
	currentPos = currentPos.replace(")","");
	console.log(currentPos);	
	
	if (currentPos != null){
	    currentPos = currentPos.split(",");
	    $.getJSON('epa_echo_full_final.json', function(data) {
	    
		    $.each(data, function(key, value){
			    if(value.LRTLat != ""){
				    var text = calculateDistance(currentPos[0], currentPos[1], value.LRTLat, value.LRTLon)+"mi";
				    console.log("text; " + text);
    		    } 
		    });		    		    
		});
	}else{
//	    var text = "";
	}
	
}


function calculateDistance(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var dLat = (lat2-lat1).toRad();
  console.log("dLAT = "+dLat);

  /* Converts numeric degrees to radians */	  
  if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
    }
  }
  
  var dLon = (lon2-lon1).toRad();
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos((lat1* Math.PI / 180).toRad()) * Math.cos((lat2* Math.PI / 180).toRad()) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c * 0.621371192;// km to mi
  
  return d.toFixed(1);
}
/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}