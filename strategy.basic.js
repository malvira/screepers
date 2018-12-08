/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('strategy.basic');
 * mod.thing == 'a thing'; // true
 */

var debug = require('debug').none;

var strategyBasic = {
    run: function () {
        debug("run strategy Basic");
        
        // keep track of our rooms 
        // set default directive for new rooms.
        // don't worry about optimization for now.
        
        for (const i in Game.rooms) {
            debug("checking " + Game.rooms[i].name);
            
            if (!Game.rooms[i].memory.hasOwnProperty('directive')) {
                Game.rooms[i].memory.directive = "grow";
            }
            
        }

	// regen the rooms
	Memory.roomList = {};
	Memory.workersWanted = 0;
	
	for (const i in Game.flags) {
	    var f = Game.flags[i];
	    if(!Memory.roomList[f.pos.roomName]) { Memory.roomList[f.pos.roomName] = { workers: 0 } };
	    Memory.roomList[f.pos.roomName].flag = true;
	    if (!f.room) {
		Memory.workersWanted++;
	    } else {
		var s = f.room.find(FIND_SOURCES);
		Memory.roomList[f.room.name].sources = s.length;
		Memory.workersWanted += s.length * 3;
	    }
	}

	for (const i in Game.spawns) {
	    var s = Game.spawns[i];
	    if(!Memory.roomList[s.room.name]) { Memory.roomList[s.room.name] = { workers: 0 } };
	    Memory.roomList[s.room.name].spawn = true;
	    var r = Game.rooms[s.room.name];
	    sources = r.find(FIND_SOURCES);
	    Memory.roomList[s.room.name].sources = sources.length;
	    Memory.workersWanted += sources.length * 3;
	}

	for (const i in Game.creeps) {
	    ra = Game.creeps[i].memory.room_assignment;
	    if(ra) { Memory.roomList[ra].workers++; }
	}
	
        debug("done strategy Basic");
    },

    assignRoom: function(c) {
	for (const name in Memory.roomList) {
	    var r = Memory.roomList[name];
	    if (r.workers < r.sources * 3 || (!r.sources && r.workers < 1)) {
		debug("assignRoom", name);
		Memory.roomList[name].workers++;
		c.memory.room_assignment = name
		break;
	    }
	}
	// if we got to this point, assign to the room the creep is in
	c.memory.room_assignment = c.room.name;
	
    }
    
};

module.exports = strategyBasic;
