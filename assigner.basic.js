/// XXX todo, creeps will have room assignments. not sure how those get made yet.

var debug = require('debug').none;

var ROOM = 'W4N42';

var strategy = require('strategy.basic');

var assignerBasic = {
    worker: function(c) {

	switch(c.memory.task) {
	case 'free':

        strategy.assignRoom(c);

	    var r = Game.rooms[c.memory.room_assignment];

	    var sources = r.find(FIND_SOURCES);
	    	    
	    c.memory.task = 'harvest';
	    // load balance between all of the sources in the assigned room
	    c.memory.target = sources[Game.time % sources.length].id;
	    
	    debug("assigning " + c.name + " to harvest " + c.memory.target);
	    
	    break;
	    
	case 'full':

	    // hardcode this room for now
	    var r = Game.rooms[ROOM];
	    
	    debug(r.controller.ticksToDowngrade);
	    
	    if (r.controller.ticksToDowngrade < 4000) {
		c.memory.task = 'upgrade';
		c.memory.target = r.controller.id;
		break;
	    }

	    // XXX needs to be the creeps home room not harvest room.
	    var targets = r.find(FIND_STRUCTURES, {
		filter: (structure) => {
	    	    return (structure.structureType == STRUCTURE_EXTENSION || 
                            structure.structureType == STRUCTURE_SPAWN) &&
			structure.energy < structure.energyCapacity;
		}
            });
	    
	    if (targets.length != 0 ) {
		c.memory.task = 'store';
		c.memory.target = targets[0].id;
		break;
	    }
	    
	    targets = r.find(FIND_CONSTRUCTION_SITES);

	    if (targets.length != 0 ) {
		c.memory.task = 'build';

		// find a construction site with the most progress
		var t = 0;
		for (const i in targets) {
		    var new_progress = targets[i].progress / targets[i].progressTotal
		    var t_progress = targets[t].progress / targets[t].progressTotal
		    if (new_progress > t_progress) { t = i; }
		}
		c.memory.target = targets[t].id;
		break;
	    }

	    // else
	    
	    c.memory.task = 'upgrade';
	    c.memory.target = r.controller.id;
	   
	    break;
	}
	
	
    }, // end worker:
}

module.exports = assignerBasic;
