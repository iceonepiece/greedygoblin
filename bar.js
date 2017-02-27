
var url = 'mongodb://localhost:27017/storylog';
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

function one( db, colName, condition ){

  return new Promise(function(resolve, reject){

    var collection = db.collection(colName);

    condition = condition || {};

    collection.find(condition).toArray(function(err, result){
      if(err) reject(err);
      console.log(result);
      resolve(result);
    });
  });
}

var thisUser = {
  '_id': new ObjectId("5761298699391b5a038e0ca0")
};


MongoClient.connect(url, function(err, db) {
  if(!err) console.log('Successfully Connect DB...');

  one(db, 'users', thisUser )
  .then(function(data){
    db.close();
  })
  .catch(function(err){
    console.log(err.message);
  });
});
