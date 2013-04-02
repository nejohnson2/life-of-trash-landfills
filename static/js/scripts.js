jQuery(document).ready(function() {


   
    
    geocoder = new google.maps.Geocoder();

    if ( $('#mapHome')[0] ){
        initializeHomeMap();
        getPosition();
        getTodaysEvents();
    }
    if ( $("#mapEvent")[0] ){
        initializeOneMap();
    }
    
    
    infowindow= new google.maps.InfoWindow({
        maxWidth: 200
    });

    $(".momentFromNow").each(function(){
        $(this).html(moment(new Date($(this).html())).fromNow());
    });
    $(".convertToMoment").each(function(){
        //var newdate = moment(new Date($(this).html()));
        //newdate.format("dddd, MMMM Do YYYY, h:mm a");
        $(this).html(moment(new Date($(this).html())).calendar());
        
    });
    
    //init modal window for event info
    jQuery("#myModal").dialog({
		autoOpen: false,
		show: "blind",
		hide: "blind",
		height: 240,
		modal: true
	});

            jQuery('#eventName').change(function(e){
                var currentTitle = jQuery(this).val();
                jQuery("#urlslug").val(convertToSlug(currentTitle));

            });

}); //end document ready


//initialize the map on the home page
function initializeHomeMap() {
    console.log("Starting map");
    //setup map
    
    var mapstyles = [
	  {
	    featureType: "road",
	    elementType: "geometry.fill",
	    stylers: [
	      { visibility: "off" },
	      { color: "#ebeeca" },
	      { weight: 2.4 }
	    ]
	  },{
	    elementType: "labels.text.stroke",
	    stylers: [
	      { visibility: "simplified" }
	    ]
	  },{
	    featureType: "road.highway",
	    elementType: "geometry",
	    stylers: [
	      { visibility: "simplified" }
	    ]
	  },{
	    featureType: "water",
	    stylers: [
	      { visibility: "simplified" },
	      { color: "#6dc6d5" }
	    ]
	  },{
	    elementType: "geometry.fill",
	  }
	];

	var styledMap = new google.maps.StyledMapType(mapstyles,
    {name: "Styled Map"});
    
    
    var myOptions = {
          center: new google.maps.LatLng(40.7746431, -73.9701962),
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
      panControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
      },
      zoomControl: true,
      zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          position: google.maps.ControlPosition.RIGHT_TOP
      },
      scaleControl: true,
      scaleControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
      },
      streetViewControl: true,
      streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
      }
    };
    map = new google.maps.Map(document.getElementById("mapHome"), myOptions);
     map.mapTypes.set('map_style', styledMap);
     map.setMapTypeId('map_style');
    markers = [];
    
    youAreHereMarker = new google.maps.Marker({
        map: map,
        icon: "img/marker_purple.png"
    });
    
}

function getPosition(){
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function(currentPosition) {
      console.log("getting position");
      console.log(currentPosition);
      currentLat = currentPosition.coords.latitude;
      currentLong = currentPosition.coords.longitude;
      currentPos = currentLat+","+currentLong;
      //var targetLoc = localStorage.getItem("targetLoc");
      localStorage.setItem("yourLocation", currentPos);

      youAreHereMarker.setPosition(new google.maps.LatLng(currentPosition.coords.latitude,currentPosition.coords.longitude));
      
    //add onclick event listener for the markers
    google.maps.event.addListener(youAreHereMarker, 'click', function(){
        infowindow.open(map);
        infowindow.setContent("This is you!");
        infowindow.setPosition(youAreHereMarker.position);
    });
      map.panTo(youAreHereMarker.position);

        
      
    }, function(error){
      alert("Error occurred when watching. Error code: " + error);
    
    }, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});
  }
  else {
    Alert('Geolocation is not supported for this Browser/OS version yet.');
  }
};