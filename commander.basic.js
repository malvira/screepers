/* command the creeps */
/* assume everything is a workerbee for now */
/* figure out roles / types later */

var assign = require('assigner.basic');

var commanderBasic = {
    run: function() {

	// manage the creeps

        for(var name in Memory.creeps) {

            var c = Game.creeps[name];
	    
            if(!c) {
		delete Memory.creeps[name];
		console.log('Clearing non-existing creep memory:', name);
		break;
            }
	    
            // execute the tasks
	    var target = Game.getObjectById(c.memory.target);

            switch (c.memory.task) {
		// XXX build and empty cases are bugged.
		// these cases all fall through
	    case 'upgrade':
		var err = c.upgradeController(target)
            case 'build':
		var err = c.build(target)
            case 'store':
		var err = c.transfer(target, RESOURCE_ENERGY)
		
		switch (err) {
		case ERR_NOT_IN_RANGE:
		    c.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
		    break;
		case OK:
		    break;
		case ERR_NOT_ENOUGH_RESOURCES:
		case ERR_FULL:
		default:
		    c.memory.task = 'free';
		    c.memory.target = '';
		    break;
		}
		break;
            case 'harvest':
                if (c.harvest(Game.getObjectById(c.memory.target)) == ERR_NOT_IN_RANGE) {
                    c.moveTo(Game.getObjectById(c.memory.target), {visualizePathStyle: {stroke: '#ffaa00'}});
                }
		if (c.carry[RESOURCE_ENERGY] == c.carryCapacity) { c.memory.task = 'full'; c.memory.target = ''; }
                break;
	    case 'free':
	    case 'full':
		assign.worker(c);
		break;
            default:
		c.memory.task = 'free';
            }
	}      
    }
};

module.exports = commanderBasic;
