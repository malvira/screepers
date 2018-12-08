/* command the creeps */
/* assume everything is a workerbee for now */
/* figure out roles / types later */

var debug = require('debug').none;

// figure out a way to set these in one place. perhaps with Memory
var assign = require('assigner.basic');
var strategy = require('strategy.basic');

var FORCE_ROOM_ASSIGNMENT = false;

var commanderBasic = {
    run: function() {

	// manage the creeps

        for(var name in Memory.creeps) {

            var c = Game.creeps[name];
	    
            if(!c) {
		delete Memory.creeps[name];
		debug('Clearing non-existing creep memory:', name);
		break;
            }

	    if(!c.memory.room_assignment || FORCE_ROOM_ASSIGNMENT) {
		debug(c.name, "needs room assignment");
		strategy.assignRoom(c);
	    }

	    if(c.room.name != c.memory.room_assignment && (c.memory.task == 'free' || c.memory.task == 'traveling')) {
		debug("to travel?");
		debug(c.name, "need to travel ", c.memory.room_assignment);
		c.memory.task = 'traveling';
		c.moveTo(new RoomPosition(25, 25, c.memory.room_assignment), {reusePath: 50});
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
		    c.moveTo(target, {reusePath: 50, visualizePathStyle: {stroke: '#ffffff'}});
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
                    c.moveTo(Game.getObjectById(c.memory.target), {reusePath: 50, visualizePathStyle: {stroke: '#ffaa00'}});
                }
		if (c.carry[RESOURCE_ENERGY] == c.carryCapacity) { c.memory.task = 'full'; c.memory.target = ''; }
                break;
	    case 'free':
	    case 'full':
		assign.worker(c);
		break;
	    case 'traveling':
		if(c.room.name == c.memory.room_assignment) {
		    debug("in room!");
		    c.moveTo(25, 25);
		    c.memory.task = 'free';
		    c.memory.target = '';
		}
		break;
            default:
		c.memory.task = 'free';
            }
	}      
    }
};

module.exports = commanderBasic;
