
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define a new schema
var FacilitySchema = new Schema({
    slug : { type: String, lowercase: true, unique: true },
    name : String,
    address : { 
    	street: String,
    	city: String,
    	state: String,
    	county: String,
    	zip: String,
    	region: String    	
    },
    location : {
	    LRTlat: String,
	    LRTlon: String,
	    mediaLat: String,
	    mediaLon: String
    },
    minority : String,
    dayLastInspection  : String,
    lastInspection	: Date,
    status : Boolean,
    details : {
	    FRSID : String,
	    programId : String,
	    permitType : String,
	    penaltyAmount : String,
	    lastPenalty : Date,
	    GHGReleases : String
    }
});

// export 'Astronaut' model
module.exports = mongoose.model('Facility',FacilitySchema);