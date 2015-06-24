var map;
var dif;
var mode;
var names = []
var coords = []
i=0
var aleatorio;
var timer = '';
var user;
var solucion;
var estado = 0;
var ngames=0;
var final;
var juegoVal;
var markers;

 function start() {

    map.removeLayer(markers);
    markers = new L.FeatureGroup();

   dif = $("#dif option:selected").val();
   mode = $("#mode option:selected").val();
	$("#solu").html("");
	getJson(mode);

	map.remove();
	map = L.map('map').setView([40.2838, -3.8215], 2);
	markers = new L.FeatureGroup();
    $('#H').hide();

	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);


    map.on('click', function(e) {
            check(e.latlng);
            clearInterval(timer);
	    html = "<img  id=\"foto\"  src='img/the-end.jpg'>";           
            $("#clue").html(html);
	
    });

}	

	function getJson(name){
	    $.getJSON('juegos/' + name, function(data) {	
	    names = []
            coords = []
            data.features.forEach(function(u){                
                names.push(u.properties.name);
                coords.push(u.coordinates);
            });
            aux()
        }) 
        
    }

    function aux(){

        aleatorio = Math.round(Math.random()*10);
        i=0;
        fotos(names[aleatorio]);
        timer = setInterval(function () {fotos(names[aleatorio])}, dif);        
    }
    
    function hist(){
  	$('#historial').show(); 
  	$('#H').show();
    }

    function end(){
     markers = new L.FeatureGroup();
  
	    html = "<img  id=\"foto\"  src='img/the-end.jpg'>";           
            $("#clue").html(html);
  	    $('#historial').hide();
  	    $('#H').hide();
            clearInterval(timer);
    }

    function fotos(tag){
        if(i<5){

            i++
            $.getJSON("https://api.flickr.com/services/feeds/photos_public.gne?&tags=" + tag + "&tagmode=any&format=json&jsoncallback=?",
                function(data){
                    html = "<img id=\"foto\" src=" + data.items[i].media.m + ">";   
       
                    $("#clue").html(html);
                }  
            )
        }else{
            html = "<img  id=\"foto\"  src='img/the-end.jpg' >";           
            $("#clue").html(html)

        if(timer != ''){
            clearInterval(timer);
        }
        }
    }



function check(usuario){



        user = L.marker([usuario.lat,usuario.lng]);
        user.bindPopup("<p>My guess</p>", {
            showOnMouseOver: true
        });
        solucion = L.marker([coords[aleatorio][0],coords[aleatorio][1]]).addTo(map)
        solucion.bindPopup("<p>True position</p>", {
            showOnMouseOver: true
        });
      	markers.addLayer(user);
      	markers.addLayer(solucion);
	map.addLayer(markers);
        //map.off();

        clearInterval(timer);
        dist = Math.round(usuario.distanceTo(solucion.getLatLng()));
        

        html = "<p>Your guess was " + dist/1000 + " Km appart</p><p>You earned: " + dist*i + " points!</p>";           
        $("#solu").html(html) 

        if(mode== 'Capitals.json'){
            juegoVal = 'Capitals'
            $("#solu").append("The capital was: <p id = 'final'>" +  names[aleatorio] + '</p>')
        }else if(mode== 'Countries.json'){
            juegoVal = 'Countries';
            $("#solu").append("The Country was: <p id = 'final'>" +  names[aleatorio] + '</p>')
        }else if(mode== 'Monuments.json'){
            juegoVal = 'Monuments'
            $("#solu").append("The monument was: <p id = 'final'>" +  names[aleatorio] + '</p>')
        } 


        date = new Date()
        date = date.toString(date)
        date= date.split(' ')[2] + ' ' + date.split(' ')[1] + ' ' + date.split(' ')[3] 

        object={puntuacion:dist*i,
                juego: mode,
                dificultad:$("#dif option:selected").val(),
                date: date
        }
         
           

        estado++;      

        $("#historial").prepend('<p>' + juegoVal + ': ' + object.puntuacion + ' Points, ' + object.date +' Difficulty: ' + $("#dif option:selected").html() +'</p><button onclick="hist1('+estado+');" id =' + estado+  '>Play Again</button><br><br>');

        history.pushState(object,null,'?'+ estado );
    }


    function hist1(num){
console.log(estado);
console.log(num);
	    ngames=ngames++;
            final = -estado + num;

console.log(final);
            if(final != 0){

	
                    history.go(final);
            }else{

                $( "#start" ).trigger( "click" );

            }
        }




$(document).ready(function() {
  
	  	$('#historial').hide(); 
		map = L.map('map').setView([40.2838, -3.8215], 2);
		markers = new L.FeatureGroup();
  	    $('#H').hide();

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { //para mapquest: http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(map);
		
		window.onpopstate = function(event){

			//if(ngames>1){
			console.log("meto" + estado);
       		    history.pushState(object,null,'?'+ estado );
//}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
			dif = event.state.dificultad;
			mode = event.state.juego;
			getJson(mode);
			map.remove();
			map = L.map('map').setView([40.2838, -3.8215], 2);
			markers = new L.FeatureGroup();
		    $('#H').hide();

			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
			}).addTo(map);
			map.on('click', function(e) {;
			    check(e.latlng);
        		    clearInterval(timer);
			    html = "<img  id=\"foto\"  src='img/the-end.jpg'>";           
			    $("#clue").html(html);

			});

		};



});
