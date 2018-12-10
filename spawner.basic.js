/* basic spawner 

separation between strategy and spawner isn't going to be great... still figuring this out.

basic spawner is per spawner centric and does not coordinate with any other spawners.

"grow" directive is taken to mean spend all the resources you can to upgrade this room agressivly. 
but how did the spawner for this room get here in the first place? this module doesn't worry about that
should be the strat level that handles that. for now its, spawns have been placed manually. Later, strat 
layer may make expansion decisions. 

*/

var debug = require('debug').none;

var spawnerBasic = {
    run: function() {
        debug('run spawner basic')
        
        for(const i in Game.spawns) {
            var s = Game.spawns[i];
            debug("spawner: " + s.name)
            
            switch(s.room.memory.directive) {
            case 'grow':
                debug("grow room directive")
                this.grow(s);
                break;
            default:
                debug("default room directive")
                this.grow(s);
            }
        }
        
        debug('done spawner basic')
    },
    
    grow: function(s) {
        debug("spawner " + s.name + " is growing room")
        
        // to grow a room we need to pump energy into the controller
        // and fully utilize our resources e.g. energy harvest etc.
        // spawner just needs to make creeps. creep actions are directed elsewhere
        
        // for basic, I think I want a hueristic based on the number of resources in the room.
        // and we are only going to have one type of creep for now...
        
        var r = s.room;
        var sources = r.find(FIND_SOURCES);
        var sites = r.find(FIND_CONSTRUCTION_SITES);
        
	
        // XXX todo, no sense of what type of creeps are in the room.
	var workername = 'workerbee-' + Game.time;
        if (Object.keys(Game.creeps).length < Memory.workersWanted) {
            console.log("spawning workerbee");

	    var e = s.room.energyAvailable;
	    console.log("energy", e);

	    if(e >= 800) {
		console.log("making 800");
		s.spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], workername);
	    } else if(e >= 550) {
		console.log("making 550");
		s.spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], workername);
	    } else if (e >= 300) {
		console.log("making 300");
		s.spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], workername);
	    } else if (e >= 200) {
		console.log("making 200");
		s.spawnCreep([WORK, CARRY, MOVE], workername);
	    }
	    
        }
      
    }
    
}

module.exports = spawnerBasic;
