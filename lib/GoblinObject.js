'use strict';


var Query = require('./Query');

function GoblinObject(db, data){
  this.db = db;
  this.collection = data.collection;
  this.key = data.key;
  this.by = data.by || null;
}

GoblinObject.prototype.which = function(inputKey){

  var condition = {};
  condition[this.key] = inputKey;

  return new Query(this, condition, 'which');
}

GoblinObject.prototype.getCollection = function(){
  return this.db.collection(this.collection);
}

GoblinObject.prototype.byOne = function(query){

  if( query.type !== 'which' ){
    throw new Error('Invalid query type!!!');
  }
  query.options[ query.key() ] = 1;

  var nextQuery = new Query(this, {}, 'byOne');
  query.setNext(nextQuery);

  return query;
}

module.exports = GoblinObject;
