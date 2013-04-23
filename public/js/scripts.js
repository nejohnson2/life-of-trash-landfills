var map;
var chicago = new google.maps.LatLng(41.850033, -87.6500523);
var topTen = [];
var markers = [];
var latlng;  //browswers lat lon

var markerIconZero = "img/markerIconWhite.png";

jQuery(document).ready(function() {
/* 	$("#sidebar").hide();	 */
	$(".collapse").collapse()

	// Get LatLng for users via browser
	if (google.loader.ClientLocation){
		latlng = new google.maps.LatLng(google.loader.ClientLocation.latitude, google.loader.ClientLocation.longitude);
	} else {
		alert("Where are you?  Can't find you location.")
		latlng = new google.maps.LatLng(41.850033, -87.6500523); //chicago 
	}
	
	drawMap();
	drawEverything();

});
function hideSidebar(){
	$("#sidebar").hide();
}
function showSidebar(){
	$("#sidebar").show();
}
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

function drawMap(){

	var mapOptions = {
	  	center: latlng,
	  	zoom: 12,
		disableDefaultUI: true,
		panControl: false,
		zoomControl: false,
		mapTypeControl: false,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};

	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);	
	
}


function searchLandfills(){
	drawMap();
	var results = [];

	var something = $("#formSearch").val();
	map.setZoom(4)

	var patt = new RegExp(something, "gi");

    //caluculate distance to landfills
	var currentPos = latlng.toString();
	currentPos = currentPos.replace("(","");
	currentPos = currentPos.replace(")","");
	currentPos = currentPos.split(",");
	console.log(currentPos);
		
    $.getJSON('epa.json', function(data) {
	    
	    $.each(data, function(key, value){

		    if(patt.test(value.Facility_Name) == true  && value.LRTLat != ""){
    
		    	// check for latlng and calculate distance 
			    if(value.LRTLat != ""){
				    var dist = calculateDistance(currentPos[0], currentPos[1], value.LRTLat, value.LRTLon);				    
    		    } 		        		    

	    	    var tmpLatLng = new google.maps.LatLng(value.LRTLat, value.LRTLon);
					
				//create landfill marker	
				var marker = new google.maps.Marker({
				    map: map,
				    position: tmpLatLng,
				    title: value.UniqueID,
				    animation: google.maps.Animation.DROP,
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
				
				var result = {
			    	value : value,
			    	dist : Number(dist),
			    	marker : marker
		    	};
		    	
		    	results.push(result);	
			    
			    //remove markers when you click elsewhere
			    google.maps.event.addListener(map, 'click', function(){
			        infowindow.close();
			    });			    
		    }
		    
	    });
	    
	    /********************  Sidebar HTML  **************************/
	    //sort the top ten and put closest on top
	    results.sort(function(a, b) {
		    return a["dist"] - b["dist"];
		});	
		
//		var foo = results[results.length - 1];
//		console.log(foo);		
//		map.fitBounds()
		results = results.reverse();
		
			
	
		for(i = 0; i < results.length; i++){

			//create html for sidebar
			var active = ""
			if(results[i].value.CAAOperatingStatus != "active"){ active = "inactive"; }else{ active = results[i].value.CAAOperatingStatus; }
			
			if(landfillHTML == ""){
				var landfillHTML = "<li landfill_id=\"" + results[i].value.UniqueID + "\"><p><strong>" + results[i].value.Facility_Name + "</p></strong><p>" + 
				results[i].dist + "mi" + " - " + 
				active + "</li>";
			} else {
				var landfillHTML = "<li landfill_id=\"" + results[i].value.UniqueID + "\"><p><strong>" + results[i].value.Facility_Name + "</p></strong><p>" + 
				results[i].dist + "mi" + " - " + 
				active + "</li>" + landfillHTML;
			}		
		}
		
		$(".loading").remove();
		$("#landfill-locations").html(landfillHTML);	
		
		
	    /********************  Bounce Animation  **************************/		
		
		$("#landfill-locations li").on('mouseover', function(){
			
		    var thisId = $(this).attr("landfill_id"); // get id from sidebar
		    
		    for(a = 0; a < results.length; a++){
		        var thisMarker = results[a].marker
		        var latLng = new google.maps.LatLng(results[a].value.LRTLat, results[a].value.LRTLon);		        
		
		        if(thisMarker.title == thisId){
			        thisMarker.setAnimation(google.maps.Animation.BOUNCE);
		        } else{
			        thisMarker.setAnimation(null);
		        }
		        
		        
		    }
		});		


/*
		$("#landfill-locations li").on('click', function(){

			  var thisId = $(this).attr("landfill_id");
			  thisid.addclass(active);

		});
*/

		

	    /********************  Zoom Animation  **************************/	
		
		$("#landfill-locations li").on('click', function(){
	        var thisId = $(this).attr("landfill_id"); // get id from sidebar
	        
	        for(a = 0; a < results.length; a++){
		        var thisMarker = results[a].marker
		        var latLng = new google.maps.LatLng(results[a].value.LRTLat, results[a].value.LRTLon);		        

		        if(thisMarker.title == thisId){
                    map.panTo(latLng);
                    map.setZoom(15)

			        thisMarker.setAnimation(google.maps.Animation.BOUNCE);
		        } else{
			        thisMarker.setAnimation(null);
		        }	
		    }		    			    

		});
/* 		$("#sidebar").show();	 */
	    
    	var landfill_length = "<p>" + results.length + "</p>";	    	
		$("#landfill_length").html(landfill_length);

	});

}

function drawEverything(){
	var results = [];

    //caluculate distance to landfills
	var currentPos = latlng.toString();
	currentPos = currentPos.replace("(","");
	currentPos = currentPos.replace(")","");
	currentPos = currentPos.split(",");
	console.log(currentPos);
		
    $.getJSON('epa.json', function(data) {
	    
	    $.each(data, function(key, value){

		    if(value.LRTLat != ""){

			    var dist = calculateDistance(currentPos[0], currentPos[1], value.LRTLat, value.LRTLon);				    
	        		    
	    	    var tmpLatLng = new google.maps.LatLng(value.LRTLat, value.LRTLon);
					
				//create landfill marker	
				var marker = new google.maps.Marker({
				    map: map,
				    position: tmpLatLng,
				    title: value.UniqueID,
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
				
				var result = {
			    	value : value,
			    	dist : Number(dist),
			    	marker : marker
		    	};
		    	
		    	results.push(result);	
			    
			    //remove markers when you click elsewhere
			    google.maps.event.addListener(map, 'click', function(){
			        infowindow.close();
			    });			    
		    }
		    
	    });
	    
	    /********************  Sidebar HTML  **************************/
	    
	    //sort the top ten and put closest on top
	    results.sort(function(a, b) {
		    return a["dist"] - b["dist"];
		});	

		results = results.slice(0,50);
		results = results.reverse();	
		
		var landfillHTML = "";
	
		for(i = 0; i < results.length; i++){

			//create html for sidebar
			var active = ""
			if(results[i].value.CAAOperatingStatus != "active"){ active = "inactive"; }else{ active = results[i].value.CAAOperatingStatus; }
			
	
				
			if(landfillHTML == ""){
				var landfillHTML = "<li landfill_id=\"" + results[i].value.UniqueID + "\"><p><strong>" + results[i].value.Facility_Name + "</p></strong><p>" + 
				results[i].dist + "mi" + " - " + 
				active + "</li>";
			} else {
				var landfillHTML = "<li landfill_id=\"" + results[i].value.UniqueID + "\"><p><strong>" + results[i].value.Facility_Name + "</p></strong><p>" + 
				results[i].dist + "mi" + " - " + 
				active + "</li>" + landfillHTML;
			}
						
		}
		
		$(".loading").remove();
		$("#landfill-locations").html(landfillHTML);	
		
		
	    /********************  Bounce Animation  **************************/		
		
		$("#landfill-locations li").on('mouseover', function(){
			
		    var thisId = $(this).attr("landfill_id"); // get id from sidebar
		    
		    for(a = 0; a < results.length; a++){
		        var thisMarker = results[a].marker
		        var latLng = new google.maps.LatLng(results[a].value.LRTLat, results[a].value.LRTLon);		        
		
		        if(thisMarker.title == thisId){

			        thisMarker.setAnimation(google.maps.Animation.BOUNCE);
		        } else{
			        thisMarker.setAnimation(null);
		        }
		        
		        
		    }
		});		

		

	    /********************  Zoom Animation  **************************/	
		
		$("#landfill-locations li").on('click', function(){
	        var thisId = $(this).attr("landfill_id"); // get id from sidebar
	        
	        for(a = 0; a < results.length; a++){
		        var thisMarker = results[a].marker
		        var latLng = new google.maps.LatLng(results[a].value.LRTLat, results[a].value.LRTLon);		        

		        if(thisMarker.title == thisId){
		            map.panTo(latLng);
                    map.setZoom(15)
			        thisMarker.setAnimation(google.maps.Animation.BOUNCE);
		        } else{
			        thisMarker.setAnimation(null);
		        }	
		    }		    			    

		});
/* 		$("#sidebar").show();	 */
	    
    	var landfill_length = "<li>" + results.length + "</li>";	    	
		$("#landfill_length").html(landfill_length);

	});


	
}



	    /********************  Location Math  **************************/	

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