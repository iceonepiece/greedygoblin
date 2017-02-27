
var nodes = {};
var links = {};

function createNode(name){
  nodes[name] = {};
}

function createLink(name, data){
  links[name] = data;
}

function list(db, name, condition, callback){
  var collection = db.collection(name);
  collection.find(condition).toArray(function(err, results) {
    callback(results);
  });
}

createNode('users');
createNode('stories');
createLink('likes', {
  user: 'users._id',
  story: 'stories._id'
});

var url = 'mongodb://localhost:27017/storylog';
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

MongoClient.connect(url, function(err, db) {
  if(!err) console.log('Successfully Connect DB...');

  var userId = new ObjectId("5761298699391b5a038e0ca0");

  var likes = db.collection('likes');
  var stories = db.collection('stories');
  var storyList = [];

  likes.find({ user: userId }).toArray(function(err, results) {
    async.eachSeries(results, function(like, done){
      stories.findOne({ _id: like.story }, function(err, story){
        storyList.push(story);
        done();
      });
    }, function(err){
      console.log('total:', storyList.length);
      for( var i = 0; i < storyList.length; i++ ){
        console.log(storyList[i]);
      }
      db.close();
    });
  });
});
