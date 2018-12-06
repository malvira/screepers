/* basic spawner 

separation between strategy and spawner isn't going to be great... still figuring this out.

basic spawner is per spawner centric and does not coordinate with any other spawners.

"grow" directive is taken to mean spend all the resources you can to upgrade this room agressivly. 
but how did the spawner for this room get here in the first place? this module doesn't worry about that
should be the strat level that handles that. for now its, spawns have been placed manually. Later, strat 
layer may make expansion decisions. 

*/

var spawnerBasic = {
    run: function() {
        console.log('run spawner basic')
        
        for(const i in Game.spawns) {
            var s = Game.spawns[i];
            console.log("spawner: " + s.name)
            
            switch(s.room.memory.directive) {
            case 'grow':
                console.log("grow room directive")
                this.grow(s);
                break;
            default:
                console.log("default room directive")
                this.grow(s);
            }
        }
        
        console.log('done spawner basic')
    },
    
    grow: function(s) {
        console.log("spawner " + s.name + " is growing room")
        
        // to grow a room we need to pump energy into the controller
        // and fully utilize our resources e.g. energy harvest etc.
        // spawner just needs to make creeps. creep actions are directed elsewhere
        
        // for basic, I think I want a hueristic based on the number of resources in the room.
        // and we are only going to have one type of creep for now...
        
        var r = s.room;
        var sources = r.find(FIND_SOURCES);
        var sites = r.find(FIND_CONSTRUCTION_SITES);
        
        //get my creeps in this room
        var c = r.find(FIND_CREEPS, {
            filter: (c) => { return (c.my)}
        });
	
        // the secret algorithm. 
        var workersWanted = 0 * sources.length + 
            0 * sites.length   + 
            8;
	
	
        // XXX todo, no sense of what type of creeps are in the room.
	var workername = 'workerbee-' + Game.time;
        if (c.length < workersWanted) {
            console.log("spawning workerbee");
            s.spawnCreep([WORK, CARRY, MOVE], workername);
        }
      
    }
    
}

module.exports = spawnerBasic;
