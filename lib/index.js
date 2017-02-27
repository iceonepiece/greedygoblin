'use strict';

var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;


function Goblin(db){
  this.db = db;
}

Goblin.prototype.greed = function(model){
  var query = new Query(this.db);
  query.add({
    type: 'greed',
    collection: model.name,
    key: model.key
  });
  return query;
}

function Query(db){
  this.chain = [];
  this.db = db;
}

Query.prototype.add = function(query){
  this.chain.unshift(query);
}

Query.prototype.done = function(model){
  this.chain.unshift({
    type: 'action',
    collection: model.name,
    inKey: model.inKey,
    outKey: model.outKey,
    condition: {}
  });
  return this;
}

Query.prototype.by = function(model){
  this.chain.push(model);
  return this;
}

Query.prototype.byOne = function(model, condition){
  this.chain.unshift({
    type: 'byOne',
    collection: model.name,
    key: model.key,
    condition: condition
  });
  return this;
}

Query.prototype.exec = function(callback){

  var finalResults = {};
  var thisChain = this.chain;
  var thisDb = this.db;

  console.log('thisChain');
  console.log(thisChain);

  async.eachSeries(thisChain, function(each, done){

    var thisCollection = thisDb.collection(each.collection);

    if(each.type === 'greed'){

      var toFindList = [];
      for( var i = 0; i < finalResults.action.length; i++ ){
        toFindList.push( finalResults.action[i]['story'] );
      }

      var condition = {};
      condition[each.key] = { '$in': toFindList };

      thisCollection
      .find(condition, {}).toArray(function(err, results) {
        finalResults.greedy = results;
        done();
      });

    } else if(each.type === 'action'){
      var options = {};
      options[each.outKey] = 1;

      var condition = {};
      condition[each.inKey] = finalResults.doer;

      thisCollection
      .find(condition, options).toArray(function(err, results) {
        finalResults.action = results;
        done();
      });
    } else if(each.type === 'byOne'){
      var options = {};
      options[each.key] = 1;
      thisCollection
      .findOne(each.condition, options, function(err, results) {
        finalResults.doer = results[each.key];
        done();
      });
    } else{
      done();
    }
  }, function(err){
    callback(finalResults.greedy);
  });
}

Goblin.prototype.close = function(){
  if(this.db) this.db.close();
}

function connect(url, callback){
  MongoClient.connect(url, function(err, connection) {
    callback(connection);
  });
}

module.exports.connect = connect;
module.exports.GoblinObject = require('./GoblinObject');
