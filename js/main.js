'use strict';

var fsClientID = 'INOUGJOA45T5I0ZFKBGQTPXEUZGBWWF2HK14KYIYYQRJVJD0';
var fsClientSecret = 'G1PXX505FRIJOT2RA3MHYCH3FW5D2EJ0GSYGNZSRNJJZHRZE';
var fsAPIURL = 'https://api.foursquare.com/v2/venues/';
var map, responseObj;

// Object literal of places for Foursquare to look for
var googleLocations = [
        {id: '51d8393dccdaed04cc926abf', place: 'Hansa Coffee Roasters', location:{ lat: 42.29115154366042, lng: -87.95615673065186}},
        {id: '4ada739ef964a520b32221e3', place: 'Firkin', location:{ lat: 42.28814872365874, lng: -87.95469992982228}},
        {id: '4b40e716f964a52021bd25e3', place: 'Wildberry Pancakes and Café', location:{ lat: 42.30539346132963, lng: -87.96036031291261}},
        {id: '4af58e58f964a520d3f921e3', place: 'Egg Harbor Café', location:{ lat: 42.28937159299249, lng: -87.95574306374016}},
        {id: '4b51ecf5f964a520a35b27e3', place: 'Independence Grove Forest Preserve', location:{ lat: 42.30695905916094, lng:-87.95242309570312}},
        {id: '540103e0498ee72e47dba8d1', place: 'Pizzeria DeVille', location:{ lat: 42.28703886873728, lng: -87.95414007265461}},
        {id: '4a52a0acf964a520d3b11fe3', place: 'Dairy Dream Drive-In', location:{ lat: 42.280053, lng: -87.97490195}},
        {id: '511042ace4b07ad353b0ce29', place: 'Shakou Sushi', location:{ lat: 42.28912439685349, lng: -87.95475735067272}},
        {id: '4b7f425af964a5200b2330e3', place: 'Thai Noodles Cafe', location:{ lat: 42.28047705, lng: -87.952541}},
        {id: '4af1f67cf964a520cde421e3', place: 'Lovin Oven Cakery', location:{ lat: 42.286781, lng: -87.9541665315628}},
        {id: '4ad0e4dff964a520d3da20e3', place: 'The Picnic Basket', location:{ lat: 42.287757, lng: -87.9545494}},
        {id: '4fc92a71e4b0b7b066893737', place: 'Chili U', location:{ lat: 42.288815632549195, lng: -87.95476692080729}},
        {id: '4ba4280af964a5204c8738e3', place: 'Liberty Restaurant', location:{ lat: 42.278904, lng: -87.953093}},
        {id: '556e8ab7498e41bee26553ca', place: 'O\'Toole\'s of Libertyville', location:{ lat: 42.287252339869205, lng: -87.95387688950558}},
        {id: '4b1de3f4f964a520241624e3', place: 'Jimmy\'s Charhouse', location:{ lat: 42.304641513596565, lng: -87.98063704963768}},
        {id: '4a8d909cf964a520111020e3', place: 'Mickey Finn\'s Brewery', location:{ lat: 42.28630948533747, lng: -87.954293196681}},
        {id: '4a9966e4f964a520202e20e3', place: 'Casa Bonita', location:{ lat: 42.28937029838562, lng: -87.954808}},
        {id: '4ba940bdf964a52058183ae3', place: 'Cafe Pyrenees', location:{ lat: 42.30484521377989, lng: -87.95796323081485}}
        ];
        
var Location = function(array) {
	// Initialize object variables
	var self = this;
	this.id = array.id;
	this.place = array.place;
	this.lat = array.location.lat;
	this.lng = array.location.lng;
	this.visible = ko.observable(true);
	this.infoWindow = new google.maps.InfoWindow({
		content: self.infoContent,
	});
	
	// Ajax call to get the data from FourSquare.
	$.ajax({
		url: fsAPIURL + self.id +'?v=20131016&client_id=' + fsClientID + '&client_secret=' + fsClientSecret,
	    type: "GET",
	    dataType: "json",
	    success: function(data){
    		responseObj = data.response.venue;
    		self.infoWindow.setContent('<div class="map-marker">'+
			'<h4>' + self.place + '</h4>' + 
    		'<div><strong>Top Tip:</strong><em> '+ responseObj.tips.groups[0].items[0].text + '</em></div><br>' +	
    		'<div><a href="' + responseObj.url + '">Website</a></div></div>');
    		
	    },
        error: function(error) {
		    console.log("There was an error " + error);
        }
	});

	// Initialize a new marker for each location
	this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(array.location),
			map: map,
			title: array.place,
			icon: makeMarkerIcon('F000F9'),
			animation: google.maps.Animation.DROP,
	});
	
	// Function to make custom markers, simply pass in a color.
	function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      }
      
	/* Show the marker if visible is set to true,
	otherwise, take it off the map by setting
	the marker to null on the map.
	*/
	this.showMarker = ko.computed(function() {
		if(this.visible() === true) {
			this.marker.setMap(map);
		} else {
			this.marker.setMap(null);
		}
		return true;
	}, this);
	
	// Add listeners to each marker
	this.marker.addListener('mouseover', function() {
		this.setIcon(makeMarkerIcon('FFFF24'));
		});
    this.marker.addListener('click', function() {
		self.infoWindow.open(map, this);
		});
	this.marker.addListener('closeclick', function() {
		this.setIcon(makeMarkerIcon('F000F9'));
		self.infoWindow.close(map, this);
		});
    this.marker.addListener('mouseout', function() {
		this.setIcon(makeMarkerIcon('F000F9'));
		});
	// Open the respective info window when the list item is clicked.	
	this.showInfo = function(){
		self.infoWindow.open(map, self.marker);
	};
};

function ViewModel() {
	var self = this;
	// Our query value which pulls from the index.html
	this.query = ko.observable('');
	this.locationList = ko.observableArray([]);
	
	// Initialize that map, son!
	map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 42.2937382, lng: -87.9544573},
			zoom: 14,
			mapTypeControl: false
	});
	
	// For each item in the initial array, add it to the KO observable array
	googleLocations.forEach(function(locationItem){
		self.locationList.push(new Location(locationItem));
	});
	
	/* Search for the index of the search once converted to lowercase,
	if it is not -1 (which means doesn't exist), then return that index.
	And make sure it is visible by passing in visible as true to that index.
	If no filter is applied then show everything.
	*/
	this.filteredLocations = ko.computed( function() {
		var filter = self.query().toLowerCase();
		if (!filter) {
			self.locationList().forEach(function(locationItem){
				locationItem.visible(true);
			});
			return self.locationList();
		} else {
			return ko.utils.arrayFilter(self.locationList(), function(item) {
				var result = (item.place.toLowerCase().search(filter) !== -1);
				item.visible(result);
				return result;
			});
		}
	}, self);
}

//initialize everything via the callback function in the google url in index.html
function initMap() {
	ko.applyBindings(new ViewModel());
}

function failure() {
	alert("Google Maps has failed to load! Please check your connection and try again.");
}