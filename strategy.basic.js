/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('strategy.basic');
 * mod.thing == 'a thing'; // true
 */

var ROOM = 'W3N5';

var strategyBasic = {
    run: function () {
        console.log("run strategy Basic");
        
        // keep track of our rooms 
        // set default directive for new rooms.
        // don't worry about optimization for now.
        
        for (const i in Game.rooms) {
            console.log("checking " + Game.rooms[i].name);
            
            if (!Game.rooms[i].memory.hasOwnProperty('directive')) {
                Game.rooms[i].memory.directive = "grow";
            }
            
        }
        
        console.log("done strategy Basic");
    },

    assignRoom: function(c) {
	c.memory.room_assignment = ROOM;
    }
    
};

module.exports = strategyBasic;
