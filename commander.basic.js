/* command the creeps */
/* assume everything is a workerbee for now */
/* figure out roles / types later */

/*XXX todo - multiroom */
var ROOM='W4N42'

var commanderBasic = {
    run: function() {
        var thisRoom = Game.rooms[ROOM];
        
        console.log("start commanderBasic");
        var m = 0; 
        var n = 0;
        var k = 0;
        
        for (const i in Game.creeps) {
            var c = Game.creeps[i];
            
            switch (c.memory.task) {
                case 'build':
                    n++;
                    break;
                case 'store':
                    m++;
                    break;
                case 'upgrade':
                    k++;
                    break;
            }
        }
        
        for (const i in Game.creeps) {
            var c = Game.creeps[i];

// XXX figure out a way to not recompute this for each creep            
        var sources = thisRoom.find(FIND_SOURCES);
        var targets = thisRoom.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || 
                                    structure.structureType == STRUCTURE_SPAWN) &&
                                    structure.energy < structure.energyCapacity;
                        }
                    });
        
        var sites = thisRoom.find(FIND_CONSTRUCTION_SITES);
                
            // assign task
            if (c.carry[RESOURCE_ENERGY] == 0 && c.memory.task != 'harvest') {
                c.memory.task = 'harvest-needtarget'
            }
            
            if (c.carry[RESOURCE_ENERGY] == c.carryCapacity && c.memory.task == 'harvest') {
                // fill storage then start upgrading
                
                if (thisRoom.controller.ticksToDowngrade < 4000) {
                    k++;
                    c.memory.task = 'upgrade';
                    break;
                }
                
                if (sites.length > 0 && (n <= m || n <= k*2)) {
                        n++;
                        c.memory.task = 'build';
                } else if(targets.length > 0 && (m <= n || m <= k*2)) {
                        m++;
                        c.memory.task = 'store';
                } else {
                    k++;
                    c.memory.task = 'upgrade';
                }
            }
            
            console.log(m, n, k);
            
            // swtich anything storing to upgrade when the storage is full.
            if (c.memory.task == 'store' && targets.length == 0) {
                c.memory.task = 'upgrade';
            }
            
            // execute the tasks
            switch (c.memory.task) {
                case 'build':
                    if(c.build(sites[0]) == ERR_NOT_IN_RANGE) {
                        c.moveTo(sites[0]);
                    }
                case 'store':
                    if(c.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        c.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    break;
                case 'upgrade':
                    if(c.upgradeController(c.room.controller) == ERR_NOT_IN_RANGE) {
                        c.moveTo(thisRoom.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    break;
                    // this is hard b/c a source might be unreachable or not safe.
                    // XXX todo: harvest from the source w/ most energy
                    // and pick up energy from the ground first
                case 'harvest-needtarget':
                    var maxSource = 0;
                    for (const i in sources) {
                        if (sources[i].energy > sources[maxSource].energy) {
                            maxSource = i;
                        }
                    }
                    c.memory.target = sources[maxSource].id;
                    c.memory.task = 'harvest'
                    // fall through to harvest
                case 'harvest':
                    if (c.harvest(Game.getObjectById(c.memory.target)) == ERR_NOT_IN_RANGE) {
                        c.moveTo(Game.getObjectById(c.memory.target), {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                    break;
                default:
                    c.memory.task = 'harvest-needtarget';
            }
            
            
        }
    }
};

module.exports = commanderBasic;