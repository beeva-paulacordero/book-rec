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

console.log(libros);

//libros = '"2900000014271","2900000089091"';
arrayquery = "START aa=node:Libro('codigo_libro:("+libros+")')\n" 
	+ "MATCH aa<-[r:IND1_JACCARD]->(v:Libro)\n"
	+ "WHERE NOT v.codigo_libro IN ["+ libros + "]\n"
	+ "RETURN SUM(r.valor) AS indice, v.codigo_libro AS id, v.nombre AS t \n"
	+ "ORDER BY indice DESC\n"
	+ "LIMIT " + limit + "\n";

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
		
		arrayquery = "START aa=node:Libro('codigo_libro:("+libros+")')\n" 
	+ "MATCH aa<-[r:IND1_JACCARD]->(v:Libro)\n"
	+ "WHERE NOT v.codigo_libro IN ["+ libros + "] AND (aa.tipo=v.tipo) AND (aa.familia=v.familia) AND (aa.subfamilia=v.subfamilia)\n"
	+ "RETURN SUM(r.valor) AS indice, v.codigo_libro AS id, v.nombre AS t \n"
	+ "ORDER BY indice DESC\n"
	+ "LIMIT " + limit + "\n";

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

		arrayquery = "START aa=node:Libro('codigo_libro:("+libros+")')\n" 
	+ "MATCH aa<-[r:IND1_JACCARD]->(v:Libro)\n"
	+ "WHERE NOT v.codigo_libro IN ["+ libros + "] AND (aa.tipo=v.tipo)\n"
	+ "RETURN SUM(r.valor) AS indice, v.codigo_libro AS id, v.nombre AS t \n"
	+ "ORDER BY indice DESC\n"
	+ "LIMIT " + limit + "\n";

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

		arrayquery = "START aa=node:Libro('codigo_libro:("+libros+")')\n" 
	+ "MATCH aa<-[r:IND1_JACCARD]->(v:Libro)\n"
	+ "WHERE NOT v.codigo_libro IN ["+ libros + "] AND (aa.familia=v.familia) AND (aa.subfamilia=v.subfamilia) \n"
	+ "RETURN SUM(r.valor) AS indice, v.codigo_libro AS id, v.nombre AS t \n"
	+ "ORDER BY indice DESC\n"
	+ "LIMIT " + limit + "\n";

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

