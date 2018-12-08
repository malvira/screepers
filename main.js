
var debug = require('debug').print;

var strategy = require('strategy.basic');
var spawner = require('spawner.basic');
var commander = require('commander.basic');
var utils = require('utils');

module.exports.loop = function () {

    // execute strategic things 
    strategy.run();

    // manage spawning
    
    spawner.run();

    // command the creeps
    commander.run();
    
    debug("finished loop " + Game.time);

}
