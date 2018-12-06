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
	    case 'upgrade':
            case 'build':
            case 'store':
		var err;
		switch (c.memory.task) {
		case 'upgrade':
		    err = c.upgradeController(target);
		    break;
		case 'build':
		    err = c.build(target);
		    break;
		case 'store':
		    err = c.transfer(target, RESOURCE_ENERGY);
		    break;
		}

		switch (err) {
		case ERR_NOT_IN_RANGE:
		    c.moveTo(target, {reusePath: 1500, visualizePathStyle: {stroke: '#ffffff'}});
		    break;
		case OK:
		    break;
		case ERR_NOT_ENOUGH_RESOURCES:
		    c.memory.task = 'free';
		    c.memory.task = '';
		    break;
		case ERR_FULL:
		default:
		    c.memory.task = 'full';
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
