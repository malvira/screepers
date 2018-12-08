/// XXX todo, creeps will have room assignments. not sure how those get made yet.

var ROOM = 'W2N5';

var assignerBasic = {
    worker: function(c) {

	switch(c.memory.task) {
	case 'free':

	    var r = Game.rooms[c.memory.room_assignment];

	    var sources = r.find(FIND_SOURCES);
	    	    
	    c.memory.task = 'harvest';
	    // load balance between all of the sources in the assigned room
	    c.memory.target = sources[Game.time % sources.length].id;
	    
	    console.log("assigning " + c.name + " to harvest " + c.memory.target);
	    
	    break;
	    
	case 'full':

	    // hardcode this room for now
	    var r = Game.rooms[ROOM];
	    
	    console.log(r.controller.ticksToDowngrade);
	    
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
		c.memory.target = targets[0].id;
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
