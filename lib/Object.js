'use strict';

var Query = require('./Query');

function GoObject(data){
  this.collection = data.collection;
  this.key = data.key;
}

Object.prototype.key = function(inputKey){

  var condition = {};
  condition[this.key] = inputKey;

  var query = new Query(condition);

  return query;
}

module.exports = Object;
