var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var http = require( 'http' );
var path  = require( 'path' );
var scraperjs = require('scraperjs');

var db = require("mongojs").connect('mongodb://localhost/books', ['books']);

var knowledgeGraph = require('./consultasServer');
var ModelKnowledgeGraph = new knowledgeGraph();

app.use( bodyParser.json({limit: '100mb'}));     // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({ extended: false, limit: '100mb' }));

// Enables CORS
var enableCORS = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
 
// enable CORS!
app.use(enableCORS);


var error = function(){
  console.log("Error en la consulta");
}

var crearWhere = function (lista){
	
	var cadena = "";
	var count = 0;

	console.log("ESTA ES LA LISTA DE IDS.... " + lista + " Y SU LONGITUD: " + lista.length);

	for(var i=0; i<lista.length; i++){
		if(i!==lista.length-1){
			cadena += " l.codigo_libro='" + lista[i] + "' OR";
		}else{
			cadena += " l.codigo_libro='" + lista[i] + "'";
		}
	}

	return cadena;
}

var crearJSON = function (req, resultado){
	var message = '{"result":' + JSON.stringify(resultado) + '}';

	//var message = req.query.callback + "(" + '{"result":' + JSON.stringify(resultado) + '}' + ");";

	return message;
}

var recomendarPost = function(req, res){

 	var collectLibros = req.body.libros;
 	var limit = req.body.limite;
 	var tipo = parseInt(req.body.tipo);
 	var familia = parseInt(req.body.familia);

 	var resultado;

 	res.setHeader('Content-Type', 'application/json');

 	if (collectLibros.length>0){

 		console.log(collectLibros);
 		
 		var where = crearWhere(req.body.libros);

	 	if((tipo==1)&&(familia==1)){
	 		
	 		ModelKnowledgeGraph
	 		.consultaColeccionConFiltros(where, limit, resultado)
	 		.then(function(resultado) { res.send(crearJSON(req, resultado));})
	 		.fail().done();

	 	}else if ((tipo==1)&&(familia==0)){

	 		ModelKnowledgeGraph
	 		.consultaColeccionConFiltroTipo(where, limit, resultado)
	 		.then(function(resultado) { res.send(crearJSON(req, resultado));})
	 		.fail().done();

	 	}else if ((tipo==0)&&(familia==1)){

	 		ModelKnowledgeGraph
	 		.consultaColeccionConFiltroFamilia(where, limit, resultado)
	 		.then(function(resultado) { res.send(crearJSON(req, resultado));})
	 		.fail().done();

	 	}else if ((tipo==0)&&(familia==0)){
	 		ModelKnowledgeGraph
	 		.consultaColeccionSinFiltro(where, limit, resultado)
	 		.then(function(resultado) { res.send(crearJSON(req, resultado));})
	 		.fail().done();

	 	}else{

	 		res.send("Error en parametros tipo/familia (0||1)");
	 	}

 	}else {

 		res.send("Error al consultar el recomendador: *** Debe introducir el código de un libro ***");

 	}
}



//app.get('/books/mock.json/:books', recomendarGet);
app.post('/books/', recomendarPost);

app.get(  '/cover', function ( req, res, next ){
  var query = encodeURIComponent(req.query['query']).replace('%20','+');
  var url = 'http://bigbooksearch.com/query.php?SearchIndex=books&Keywords=' + query + '&ItemPage=1';
  scraperjs.StaticScraper.create(url)
    .scrape(function($) {
        return $("img").map(function() {
            return {src:$(this).attr('src'), title:$(this).attr('alt')};
        }).get();
    }, function(books) {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(books));
    })
});

app.get(  '/search', function ( req, res, next ){
  var query = encodeURIComponent(req.query['query']).replace(/%20/g,' ');
  db.books.find({t: {$regex:query.toUpperCase()}}, function(err, docs) {
    if( err || !docs) {
      console.log("No female users found");
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify([]));
    }
    else{
      var arr = []
      docs.forEach(function(item) { arr.push({"id": item.i, "t" : item.t }); });
      var result = {books:arr.slice(0, 50)};
      res.setHeader('Content-Type', 'application/json');
	message = req.query.callback + "(" + JSON.stringify(result) + ");";
	return res.end(message);
    }
  });
});

app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});