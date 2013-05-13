var modals = [];

function getModal(){
	console.log("modal action");
	$.getJSON('epa.json', function(data) {
		    
	    $.each(data, function(key, value){	    
	
	
			var modalHTML = "<div id=\"myModal\"" + value.UniqueID + " class=\"modal hide fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\""+" aria-hidden=\"true\">" +
				"<div class=\"modal-header\">" + 
				    "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>" +
				    "<h3 id=\"myModalLabel\">" + value.Facility_Name + "</h3> " +
				  "</div> " +
				  "<div class=\"modal-body\">" + 
				    "<p>One fine body…</p>"  +
				  "</div>" +
				  "<div class=\"modal-footer\">" +
				    "<button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">Close</button>" +
				    "<button class=\"btn btn-primary\">Save changes</button>" + 
				  "</div>" + 
				"</div>" + modalHTML;
				
			$("#master").html(modalHTML);	
/* 			$('#myModal'+ value.UniqueID + '').modal; */
			console.log("hello model");
//			modals.push(modalHTML);
		});
	});
}