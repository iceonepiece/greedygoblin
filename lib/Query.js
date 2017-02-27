
var async = require('async');

function Query(goblinObject, condition, type){
  this.goblinObject = goblinObject;
  this.condition = condition;
  this.options = {};
  this.type = type;
  this.next = null;
  this.heritage = {};
}

Query.prototype.setNext = function(nextQuery){
  this.next = nextQuery;
}

Query.prototype.key = function(){
  return this.goblinObject.key;
}

Query.prototype.by = function(){
  return this.goblinObject.by;
}

Query.prototype.getCollection = function(){
  return this.goblinObject.getCollection();
}


Query.prototype.greed = function(callback){

  var currentQuery = this;
  var finalResult = null;

  async.whilst(function(){
    return currentQuery != null;
  }, function(next){

    var thisCollection = currentQuery.getCollection();

    console.log(currentQuery.type);

    if( currentQuery.type === 'which' ){

      thisCollection
      .findOne(currentQuery.condition, currentQuery.options, function(err, result) {
        currentQuery = currentQuery.next;
        if(currentQuery != null){
          currentQuery.heritage.key = result[currentQuery.key()];
        } else{
          finalResult = result;
        }
        next();
      });

    } else if( currentQuery.type === 'byOne' ){

      var condition = {};
      condition[currentQuery.by()] = currentQuery.heritage.key;

      thisCollection
      .find(condition, currentQuery.options).toArray(function(err, results) {
        currentQuery = currentQuery.next;

        if(currentQuery != null){

        } else{
          finalResult = results;
        }

        next();
      });

    } else {
      currentQuery = currentQuery.next;
      next();
    }

  }, function(err){
    callback(null, finalResult);
  });
}


module.exports = Query;
