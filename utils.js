function killCreeps() {
    for (const i in Game.creeps) {
	Game.creeps[i].suicide();
    }
}

module.exports = {
    killCreeps: killCreeps,
};
