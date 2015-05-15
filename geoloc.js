var map;
		
addr_search = function () {
    var inp = document.getElementById("addr");

    $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {
        var items = [];

        $.each(data, function(key, val) {
            items.push(
                "<li><a href='#' onclick='chooseAddr(" +
                val.lat + ", " + val.lon + ");return false;'>" + val.display_name +
            '</a></li>'
            );
        });
        
        $('#results').empty();
        if (items.length != 0) {
            $('<p>', { html: "Search results:" }).appendTo('#results');
            $('<ul/>', {
            'class': 'my-new-list',
            html: items.join('')
            }).appendTo('#results');
        } else {
            $('<p>', { html: "No results found" }).appendTo('#results');
        }
        
        $('<p>', { html: "<button id='close' type='button'>Close</button>" }).appendTo('#results');
        $("#close").click(function (){$("#results").empty();});
        
        var ciudad = $("#addr").val();
        console.log(ciudad);
        var urlFlickr = "http://api.flickr.com/services/feeds/photos_public.gne?tags=" + ciudad + "&tagmode=any&format=json&jsoncallback=?";
        
        $.getJSON(urlFlickr, function(data) { 
            $.each( data.items, function( i, item ) {
                $( "<img>" ).attr( "src", item.media.m ).appendTo( "#results" );
                if ( i === 4 ) {
                    return false;
                }
            });
        });
        
        
    });
}


function chooseAddr(lat, lng, type) {
  var location = new L.LatLng(lat, lng);
map.panTo(location);

  if (type == 'city' || type == 'administrative') {
    map.setZoom(11);
  } else {
    map.setZoom(13);
  }
}



$(document).ready(function() {
  
 


		map = L.map('map').setView([40.2838, -3.8215], 2);


		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { //para mapquest: http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(map);

		var marker = L.marker([40.2838,-3.8215]).addTo(map);
		marker.bindPopup("<b>Estas aqui. </b>").openPopup();

	$.getJSON( "geojson.json", function( data ) {
			var myLayer = L.geoJson().addTo(map);
			myLayer.addData(data);
	});

	map.on('click', function(e) {

		L.marker(e.latlng).addTo(map).bindPopup("coords: "+e.latlng).openPopup();

	});

});
