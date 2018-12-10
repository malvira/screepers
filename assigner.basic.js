/// XXX todo, creeps will have room assignments. not sure how those get made yet.

var debug = require('debug').none;

var strategy = require('strategy.basic');

var assignerBasic = {
    worker: function(c) {

	switch(c.memory.task) {
	case 'free':

            strategy.assignRoom(c);
	    if(c.room.name != c.memory.room_assignment) { c.memory.task = 'traveling'; return; }
	    
	    var r = Game.rooms[c.memory.room_assignment];


	    var sources = r.find(FIND_SOURCES);

	    // dropped energy
	    // bugged
	    // sources += r.find(FIND_DROPPED_RESOURCES, {
	    // 	filter: (r) => {
	    // 	    return(r.resourceType == RESOURCE_ENERGY);
	    // 	}
	    // });

	    // tombstones
	    // more complicated
	    // sources += r.fine(FIND_TOMBSTONES, {
	    // 	filter: (t) => {
	    // 	    return (t.);
	    // 	}
	    // });
	    
	    c.memory.task = 'harvest';
	    // load balance between all of the sources in the assigned room
	    c.memory.target = sources[Game.time % sources.length].id;
	    
	    debug("assigning " + c.name + " to harvest " + c.memory.target);
	    
	    break;
	    
	case 'full':

	    // get our home room
	    if (!c.memory.room_home) {
		strategy.assignHome(c);
	    }
	    var r = Game.rooms[c.memory.room_home];
	    
	    debug(r.controller.ticksToDowngrade);
	    
	    if (r.controller.ticksToDowngrade < 4000) {
		c.memory.task = 'upgrade';
		c.memory.target = r.controller.id;
		break;
	    }

	    var targets = r.find(FIND_STRUCTURES, {
		filter: (structure) => {
	    	    return (structure.structureType == STRUCTURE_EXTENSION || 
                            structure.structureType == STRUCTURE_SPAWN) &&
			structure.energy < structure.energyCapacity;
		}
            });

	    // storage
	    if (targets.length != 0 ) {
		c.memory.task = 'store';
		c.memory.target = targets[0].id;
		break;
	    }

	    // filling towers
	    targets = r.find(FIND_STRUCTURES, {
		filter: (s) => {
		    return (s.structureType == STRUCTURE_TOWER &&
			    s.energy < 1000);
		}
	    });
	    if (targets.length != 0 ) {
		c.memory.task = 'store';
		// XXX todo, fill most empty tower
		c.memory.target = targets[0].id;
		break;
	    }

	    
	    // construction
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
