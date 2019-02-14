var socket = io.connect('http://188.166.22.231:80', {
    secure: true
});
var markers = [];

var arrets = [];

var arretsMarkers = [];

var arretIcon171 = L.icon({
    iconUrl: './img/arretpointer171.png',
    iconSize: [25, 47],
    iconAnchor: [25, 47],
    popupAnchor: [-12.5, -50]
});

var arretIconCO1 = L.icon({
    iconUrl: './img/arretpointerCO1.png',
    iconSize: [25, 47],
    iconAnchor: [25, 47],
    popupAnchor: [-12.5, -50]
});

var arretIconCO2 = L.icon({
    iconUrl: './img/arretpointerCO2.png',
    iconSize: [25, 47],
    iconAnchor: [25, 47],
    popupAnchor: [-12.5, -50]
});

var map = L.map('map', {
    center: [45.8467543, 5.0430183],
    zoom: 13
});

jQuery.getJSON('./171.json', function (data) {
    for(i = 0; i < data.arrets.length; i++) {
		data.arrets[i].ligne = "171";
        arrets.push(data.arrets[i]);
    }
	
	updateMarkers();
});

jQuery.getJSON('./CO1.json', function (data) {
    for(i = 0; i < data.arrets.length; i++) {
		data.arrets[i].ligne = "CO1";
        arrets.push(data.arrets[i]);
    }
	
	updateMarkers();
});

jQuery.getJSON('./CO2.json', function (data) {
	for(i = 0; i < data.arrets.length; i++) {
		data.arrets[i].ligne = "CO2";
		arrets.push(data.arrets[i]);
    }
	
	updateMarkers();
});

function updateMarkers() {
	for(i = 0; i < arrets.length; i++) {
		var markerIcon = arretIcon171;
		
		console.log(arrets[i].ligne);
		switch(arrets[i].ligne){
			case "171":
				markerIcon = arretIcon171;
				break;
			case "CO1":
				markerIcon = arretIconCO1;
				break;
			case "CO2":
				markerIcon = arretIconCO2;
				break;
		}
		
		arretsMarkers[i] = L.marker([arrets[i].lat, arrets[i].long], {
			icon: arretIcon171
		}).addTo(map).bindPopup(arrets[i].name + "<br/>" + arrets[i].ville);
	}
}

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoicmV2ZXJzZW92ZXJmbG93IiwiYSI6ImNqcmppOWd2bTBieG40M2x4YzBicDZzcTEifQ.tOAA1wCgK2PBZdUDWsTFCg'
}).addTo(map);

socket.on("verify", function (data) {
    if (data.success) {
        console.log("[!] Connexion au serveur réussie !");
        console.log("[ID] " + data.id);
        socket.emit("set_arret", {
            arret: "A-TEST"
        });
    }
});

socket.on("notifypresence", data => {
    // A rajouter
});

socket.on("location_update", data => {
    console.log(data);
    if (markers[data.ligne]) {
        map.removeLayer(markers[data.ligne]);
    }
    markers[data.ligne] = L.marker([data.lat, data.lng]).addTo(map).bindPopup('Ligne 171<hr/>Dernière actualisation: ' + moment().format('H:mm'));
	
	arrets.forEach(arret => {
		console.log(distanceInKmBetweenEarthCoordinates(arret.lat, arret.lng, data.lat, data.lng))
	});
});

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;

    var dLat = degreesToRadians(lat2 - lat1);
    var dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}