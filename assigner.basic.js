/// XXX todo, creeps will have room assignments. not sure how those get made yet.

var ROOM = 'W2N5';

var assignerBasic = {
    worker: function(c) {

	//XXX todo: hardcoded for now.
	c.memory.room_assignment = ROOM;
	var r = Game.rooms[c.memory.room_assignment];

	switch(c.memory.task) {
	case 'free':

	    var sources = r.find(FIND_SOURCES);
	    	    
	    c.memory.task = 'harvest';
	    // load balance between all of the sources in the assigned room
	    c.memory.target = sources[Game.time % sources.length].id;
	    
	    console.log("assigning " + c.name + " to harvest " + c.memory.target);
	    
	    break;
	    
	case 'full':

	    console.log(r.controller.ticksToDowngrade);
	    
	    if (r.controller.ticksToDowngrade < 2000) {
		c.memory.task = 'upgrade';
		c.memory.target = r.controller.id;
		break;
	    }
	    
	    var targets = c.room.find(FIND_STRUCTURES, {
		filter: (structure) => {
	    	    return (structure.structureType == STRUCTURE_EXTENSION || 
                            structure.structureType == STRUCTURE_SPAWN) &&
			structure.energy < structure.energyCapacity;
		}
            });

	    // if targets is empty then use building sites
	    if (targets.length == 0) {
		targets = r.find(FIND_CONSTRUCTION_SITES);
	    }
		
	    if (targets.length != 0) {
		c.memory.task = 'build';
		c.memory.target = targets[Game.time % targets.length].id;
		console.log("assigning " + c.name + " to build " + c.memory.target);
	    } else {
		c.memory.task = 'upgrade';
		c.memory.target = r.controller.id;
	    }
	   
	    break;
	}
	
	
    }, // end worker:
}

module.exports = assignerBasic;
