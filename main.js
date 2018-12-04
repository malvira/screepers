
var strategy = require('strategy.basic');
var spawner = require('spawner.basic');
var commander = require('commander.basic');

module.exports.loop = function () {

   for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // execute strategic things 
    strategy.run();

    // manage spawning
    spawner.run();

    // command the creeps
    commander.run();
    
    console.log("finished loop " + Game.time)

}