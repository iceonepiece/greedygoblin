
var goblin = require('./lib');
var url = 'mongodb://localhost:27017/storylog';
var ObjectId = require('mongodb').ObjectID;

goblin.connect(url, function(connection){

  var User = new goblin.GoblinObject(connection, {
    collection: 'users',
    key: '_id'
  });

  var Story = new goblin.GoblinObject(connection, {
    collection: 'stories',
    key: '_id',
    by: 'user'
  });

  var Follow = new goblin.GoblinObject(connection, {
    collection: 'followings'
  });

  // New Version

  // case 1:
  /*
  var myUser = User.which(new ObjectId('5761298699391b5a038e0ca0'));

  myUser.greed(function(err, user){
    console.log(user.name);
    connection.close();
  });
  */

  // case 2: Load the stories of the target user
  /*
  var targetUser = User.which(new ObjectId('53a7f1b1b696484da5809183'));

  Story
  .byOne(targetUser)
  .greed(function(err, stories){
    console.log(stories.length);
    for(var i = 0; i < stories.length; i++ ){
      console.log(stories[i].title);
    }
    connection.close();
  });
  */

  // case 3: Load the stories of my followings
  var me = User.which(new ObjectId('5761298699391b5a038e0ca0'));

  Story
  .by(
    User
    .which(Follow)
    .by(me)
  )
  .greed(function(err, stories){
    connection.close();
  });

});
