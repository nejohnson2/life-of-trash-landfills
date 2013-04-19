var map;
var chicago = new google.maps.LatLng(41.850033, -87.6500523);
var topTen = [];

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

			    //remove markers when you click elsewhere
			    google.maps.event.addListener(map, 'click', function(){
			        infowindow.close();
			    });
				
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
    
    //remove markers when you click elsewhere
    google.maps.event.addListener(marker, 'click', function(){
        infowindow.close();
    });
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

	var currentPos = latlng.toString();
	currentPos = currentPos.replace("(","");
	currentPos = currentPos.replace(")","");
	
	if (currentPos != null){
	    currentPos = currentPos.split(",");
	    $.getJSON('epa_echo_full_final.json', function(data) {
	    
		    $.each(data, function(key, value){
			    if(value.LRTLat != "" && value.Facility_Name != ""){
				    var text = calculateDistance(currentPos[0], currentPos[1], value.LRTLat, value.LRTLon);				    
				    topTen.push({ dist: Number(text), name: value.Facility_Name, cco: value.CAAOperatingStatus});				    				 		    
    		    } 
		    });		 

		    topTen.sort(function(a, b) {
			    return a["dist"] - b["dist"];
			});	

			topTen = topTen.slice(0,10);
			topTen = topTen.reverse();
			
			console.log(topTen.length);
			
			for(i = 0; i < topTen.length; i++){
				console.log(i);
				var landfillHTML = "<li><p><strong>" + topTen[i].name + "</p></strong><p>" + 
					topTen[i].dist + "mi" + " - " + 
					topTen[i].cco + "</li>" + landfillHTML;			

			}
			
			$(".loading").remove();
			$("#today-events").html(landfillHTML);

		    $("#today-events li").live('mouseover', function(){
		        var thisId = $(this).attr("event-id");
		        
		        for (a = 0; a < markers.length; a++){
		            var thisMarker = markers[a].marker;
		            var latLng = new google.maps.LatLng(markers[a].lat, markers[a].lng);
		             
		            if (thisMarker.title == thisId){
		                for(b=0;b<markers.length; b++){
		                  //  markers[b].infowindow.close();
		                }
		                if (map.getBounds().contains(latLng) == false){
		                    map.panTo(latLng);
		                }
		                thisMarker.setAnimation(google.maps.Animation.BOUNCE);
		            } else{
		                thisMarker.setAnimation(null);
		            }
		        }
		        
		    });
		    
		    
		    
		});
	}else{
	    alert("Where are you?  Can't find you location.")
	}
	
}

// calculate distance from current locaion 
function calculateDistance(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var dLat = (lat2-lat1).toRad();

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