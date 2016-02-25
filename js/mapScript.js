var tempLatLng = {lat: -36.8576017, lng: 174.7590294};
var image = '../img/here.png';
var supermarket = '../img/supermarket.png';
var fruit = '../img/fruit.png';
var market = '../img/market.png';
var garden = '../img/garden.png';
var convenience = '../img/convenience.png';
var takeaway = '../img/takeaway.png';
var other = '../img/other.png';
var markerList = [supermarket, fruit, market, garden, convenience, takeaway, other];
var zoomAmount = 18;
var map, marker, infoWindow;
var styles = [
	{
		featureType: "poi",
		elementType: "labels",
		stylers: [
			{ visibility: "off" }
		]
	}
	,{
		featureType: "poi.school",
		elementType: "labels",
		stylers: [
			{ visibility: "on" }
		]
	}
	,{
		featureType: "poi.medical",
		elementType: "labels",
		stylers: [
			{ visibility: "on" }
		]
	}
];
var currentLatLng;

function initMap() {

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getLocation);
	}
}

function getLocation(position){

	if (typeof position !== 'undefined'){
		currentLatLng = {lat:position.coords.latitude,lng:position.coords.longitude};
	} else{
		currentLatLng = tempLatLng;
	}

	map = new google.maps.Map(document.getElementById('map'), {
		zoom: zoomAmount,
		center: currentLatLng
	});

	var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});
	//Associate the styled map with the MapTypeId and set it to display.
	map.mapTypes.set('map_style', styledMap);
	map.setMapTypeId('map_style');

	initMarker();
	initInfoWindow();
	getFoodPlaces();

}

function initMarker(){
	marker = new google.maps.Marker({
		position: currentLatLng,
		map: map,
		icon: image
	});
}

function initInfoWindow(){
	infoWindow = new google.maps.InfoWindow({
		map: map,
		content: 'You are here'
	});
	infoWindow.open(map, marker);
}

function getFoodPlaces(){
	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch({
		location: currentLatLng,
		radius: 500,
		types: ['bakery', 'bar' , 'cafe','food',
			'grocery_or_supermarket', 'hospital', 'meal_delivery' , 'meal_takeaway',
			'restaurant' , 'school']
	}, createFoodMarker);
}

function createFoodMarker(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			createMarker(results[i]);
		}
	}
}

function createMarker(place) {
	var randomNumber = Math.floor(Math.random() * (markerList.length));
	var tempImage = markerList[randomNumber];

	var marker = new google.maps.Marker({
		position: place.geometry.location,
		map: map,
		icon: tempImage
	});
	var infoWindowContent = '<p style="padding:0px; margin:0px;" onclick=\"window.location.href=\'food.html\'\">' +
		place.name + '<br> 5 min&nbsp <i class="fa fa-bicycle"></i>' +

		'<div class="row">' +

		'<div class="col-xs-4" style="padding-right:0px;">' +
		'<img style="width:40px; height:40px; padding:0px; margin:0px;" src="../img/oilBadge.png"/>' +
		'</div>' +
		'<div class="col-xs-4" style="padding-right:0px;">' +
		'<img style="width:40px; height:40px; padding:0px; margin:0px;" src="../img/saltBadge.png"/>' +
		'</div>' +
		'<div class="col-xs-4">' +
		'<img style="width:25px; height:25; padding:0px;  padding-top:15px; margin:0px;" src="../img/sugarBadge.png"/>' +
		'</div>' +

		'</div>' +
		'</p>';

	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.setContent(infoWindowContent);
		infoWindow.open(map, this);
	});
}