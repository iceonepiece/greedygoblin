'use strict';

function Action(data){
  this.data = data;
  this.name = data.name;
  this.outKey = data.out.key;
  this.inKey = data.in.key;
}

module.exports = Action;
