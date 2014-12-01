var neo4j = require('neo4j');
var Q = require ('q');

var dbneo = new neo4j.GraphDatabase(process.env.NEO4J_URL || 'http://localhost:7474');
var async= require('async');
var HashMap = require('hashmap').HashMap;

// Constructor
function ModelKnowledgeGraph(){
	// always initialize all instance properties
	this._json = "{}";
	this._id = "";
	console.log("\n[knowledgeGraph.js] Creating a conection to the Knowledge Graph.");	
}
// RECOMENDADOR SOBRE COLECCIÓN DE LIBROS

ModelKnowledgeGraph.prototype.consultaColeccionSinFiltro= function(libros, limit, res){

	var deferred = Q.defer();

		console.log("ESTOY A PUNTO DE LANZAR LA CONSULTA");

		arrayquery = "MATCH (l:Libro)<-[r:IND1_JACCARD]->(v:Libro) \n"
		+ "WHERE" + libros + " AND NOT (l.codigo_libro=v.codigo_libro) \n"
		+ "RETURN SUM(r.valor) AS indice, v.codigo_libro AS id, v.nombre AS t \n"
		+ "ORDER BY indice DESC \n"
		+ "LIMIT "+ limit +" \n"

		console.log(arrayquery);

		dbneo.query(arrayquery, function(err, information){

			if(err){
				deferred.reject(new Error(err));

			} else{
				
				deferred.resolve(information);
				console.log('\nOk! he consultado el NODO \n' + JSON.stringify(information)); 
			}
		});	 
		return deferred.promise;
}

ModelKnowledgeGraph.prototype.consultaColeccionConFiltros= function(libros, limit, res){

	var deferred = Q.defer();
		
		arrayquery = "MATCH (l:Libro)<-[r:IND1_JACCARD]->(v:Libro) \n"
		+ "WHERE" + libros + " AND (l.tipo=v.tipo) AND (l.familia=v.familia) AND (l.subfamilia=v.subfamilia) AND NOT (l.codigo_libro=v.codigo_libro) \n"
		+ "RETURN SUM(r.valor) AS indice, v.codigo_libro AS id, v.nombre AS t \n"
		+ "ORDER BY indice DESC \n"
		+ "LIMIT "+ limit +" \n"

		console.log(arrayquery);

		dbneo.query(arrayquery, function(err, information){

			if(err){
				deferred.reject(new Error(err));

			} else{
				
				deferred.resolve(information);
				console.log('\nOk! he consultado el NODO \n' + JSON.stringify(information)); 
			}
		});	 
		return deferred.promise;
}

ModelKnowledgeGraph.prototype.consultaColeccionConFiltroTipo= function(libros, limit, res){

	var deferred = Q.defer();

		arrayquery = "MATCH (l:Libro)<-[r:IND1_JACCARD]->(v:Libro) \n"
		+ "WHERE" + libros + " AND (l.tipo=v.tipo) AND NOT (l.codigo_libro=v.codigo_libro) \n"
		+ "RETURN SUM(r.valor) AS indice, v.codigo_libro AS id, v.nombre AS t \n"
		+ "ORDER BY indice DESC \n"
		+ "LIMIT "+ limit +" \n"

		console.log(arrayquery);

		dbneo.query(arrayquery, function(err, information){

			if(err){
				deferred.reject(new Error(err));

			} else{
				
				deferred.resolve(information);
				console.log('\nOk! he consultado el NODO \n' + JSON.stringify(information)); 
			}
		});	 
		return deferred.promise;
}

ModelKnowledgeGraph.prototype.consultaColeccionConFiltroFamilia= function(libros, limit, res){

	var deferred = Q.defer();

		arrayquery = "MATCH (l:Libro)<-[r:IND1_JACCARD]->(v:Libro) \n"
		+ "WHERE" + libros + " AND (l.familia=v.familia) AND (l.subfamilia=v.subfamilia) AND NOT (l.codigo_libro=v.codigo_libro) \n"
		+ "RETURN SUM(r.valor) AS indice, v.codigo_libro AS id, v.nombre AS t \n"
		+ "ORDER BY indice DESC \n"
		+ "LIMIT "+ limit +" \n"

		console.log(arrayquery);

		dbneo.query(arrayquery, function(err, information){

			if(err){
				deferred.reject(new Error(err));

			} else{
				
				deferred.resolve(information);
				console.log('\nOk! he consultado el NODO \n' + JSON.stringify(information)); 
			}
		});	 
		return deferred.promise;
}

// RECOMENDADOR SOBRE UN ÚNICO LIBRO

ModelKnowledgeGraph.prototype.consultarNodo= function(libro, res){

	var deferred = Q.defer();

	arrayquery = "MATCH (n:Libro {codigo_libro: '"+ libro +"'}) \n"
	+ "RETURN n.nombre AS nombre"

	dbneo.query(arrayquery, function(err, information){

		if(err){
			deferred.reject(new Error(err));

		} else{
			
			deferred.resolve(information);
			console.log('\nOk! he consultado el NODO \n' + JSON.stringify(information)); 
		}
	});	 
	return deferred.promise;
}

ModelKnowledgeGraph.prototype.consultaRecomendadorSinFiltro= function(libro, res){

	var deferred = Q.defer();

	arrayquery = "MATCH (n:Libro {codigo_libro: '"+ libro +"'}) <-[r:IND1_JACCARD]->(l:Libro) \n"
	+ "RETURN l.nombre AS nombre\n" 
	+ "ORDER BY r.valor DESC \n"
	+ "LIMIT 3 \n"

	console.log(arrayquery);

	dbneo.query(arrayquery, function(err, information){

		if(err){
			deferred.reject(new Error(err));

		} else{
			
			deferred.resolve(information);
			console.log('\nOk! he consultado el NODO \n' + JSON.stringify(information)); 
		}
	});	 
	return deferred.promise;
}

ModelKnowledgeGraph.prototype.consultaRecomendadorConFiltros= function(libro, res){

	var deferred = Q.defer();

	arrayquery = "MATCH (n:Libro {codigo_libro: '"+ libro +"'}) <-[r:IND1_JACCARD]->(l:Libro) \n"
	+ "WHERE n.tipo=l.tipo AND n.familia=l.familia AND n.subfamilia=l.subfamilia \n"
	+ "RETURN l.nombre AS nombre \n" 
	+ "ORDER BY r.valor DESC \n"
	+ "LIMIT 3 \n"

	console.log(arrayquery);

	dbneo.query(arrayquery, function(err, information){

		if(err){
			deferred.reject(new Error(err));

		} else{
			
			deferred.resolve(information);
			console.log('\nOk! he consultado el NODO \n' + JSON.stringify(information)); 
		}
	});	 
	return deferred.promise;
}

ModelKnowledgeGraph.prototype.consultaRecomendadorConFiltroTipo= function(libro, res){

	var deferred = Q.defer();

	arrayquery = "MATCH (n:Libro {codigo_libro: '"+ libro +"'}) <-[r:IND1_JACCARD]->(l:Libro) \n"
	+ "WHERE n.tipo=l.tipo \n"
	+ "RETURN l.nombre AS nombre \n" 
	+ "ORDER BY r.valor DESC \n"
	+ "LIMIT 3 \n"

	console.log(arrayquery);

	dbneo.query(arrayquery, function(err, information){

		if(err){
			deferred.reject(new Error(err));

		} else{
			
			deferred.resolve(information);
			console.log('\nOk! he consultado el NODO \n' + JSON.stringify(information)); 
		}
	});	 
	return deferred.promise;
}

ModelKnowledgeGraph.prototype.consultaRecomendadorConFiltroFamilia= function(libro, res){

	var deferred = Q.defer();

	arrayquery = "MATCH (n:Libro {codigo_libro: '"+ libro +"'}) <-[r:IND1_JACCARD]->(l:Libro) \n"
	+ "WHERE n.familia=l.familia AND n.subfamilia=l.subfamilia \n"
	+ "RETURN l.nombre AS nombre \n" 
	+ "ORDER BY r.valor DESC \n"
	+ "LIMIT 3 \n"

	console.log(arrayquery);

	dbneo.query(arrayquery, function(err, information){

		if(err){
			deferred.reject(new Error(err));

		} else{
			
			deferred.resolve(information);
			console.log('\nOk! he consultado el NODO \n' + JSON.stringify(information)); 
		}
	});	 
	return deferred.promise;
}

module.exports = ModelKnowledgeGraph;

