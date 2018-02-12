/*
 * growthRate (1-75) - the amount (between 0 and growthRate) a plant will grow every tick.
 * leafiness: (0-100) - the amount of leaves that're dropped when the plant is harvested.
 * sleepChance: (0-75) - percent chance the plant will fall asleep every hour
 * waterAffinity (-20-20) - the percent increase that the growthRate will experience when this plant is watered
 * name (str) - the name of the seed
 *
 * Active seed only traits
 *
 * watered (bool) - whether this plant will recieve the water bonus during the next tick.
 * lastEvent (str) - The last thing that occured on this plant.
 */


class Plant {
	constructor(user, plantData) {
		this.plantData = plantData;
		this.user = user;
	}
	/**
	 * Ticks the plant. Takes care of all the things that need to happen on the hourly job.
	 * @return {void}
	 */
	async tick() {
		if (!this.plantData.activeSeed) return;
		if (this.plantData.progress === 100) return this.plantData.activeSeed.lastEvent = "Your plant is fully grown, and ready to be harvested.";
		const growth = this.grow(this.plantData.activeSeed.growthRate);
		this.plantData.progress += growth;
		this.plantData.activeSeed.lastEvent = `Your plant has grown ${growth}% taller${this.plantData.activeSeed.watered ? ", consuming its water in the process" : ""}.`;
		this.plantData.activeSeed.watered = false;
		if (this.plantData.progress > 100) this.plantData.progress = 100;
	}
	/**
	 * Handles the generation for the growthrate that this plant should use in this tick.
	 * @param {int} growthRate - The plant's growthrate.
	 * @return {int}
	 */
	grow(growthRate) {
		const waterMultiplier = this.plantData.activeSeed.watered ? (1 + (this.plantData.activeSeed.waterAffinity / 100)) : 1;
		return Math.max((Math.floor(Math.random() * this.plantData.activeSeed.growthRate * waterMultiplier)), 3);
	}
	/**
	 * Adds a new seed to the pouch.
	 * @param {seed} seed - Object that has the properties of a seed.
	 * @return {Object}
	 */
	async addToSeeds(seed) {
		if (this.plantData.seeds.length >= 10) return {success: false, seeds: this.plantData.seeds.length};
		this.plantData.seeds.push(seed);
		return {success: true, seeds: this.plantData.seeds.length};
	}
	/**
	 * Gets the plantdata as an object.
	 * @return {Object}
	 */
	getPlantData() {
		return this.plantData;
	}
	/**
	 * Plants a seed, setting it to be grown during the hourly tick.
	 * @param {int} index - The index of the seed that should be planted.
	 * @return {Object}
	 */
	async plant(index) {
		const toPlant = this.plantData.seeds[index];
		if (!toPlant) return {success: false};
		this.plantData.activeSeed = this.plantData.seeds.splice(index, 1)[0];
		this.plantData.activeSeed.watered = false;
		this.plantData.progress = 0;
		this.plantData.activeSeed.lastEvent = "This seed was just planted.";
		return {success: true};
	}
	/**
	 * Harvests the plant, handling leaf adding, undergrown plants, etc.
	 * @return {Object}
	*/
	async harvest() {
		if (!this.plantData.activeSeed) return {success: false, leaves: null};
		const returnObject = {
			success: true,
			grown: this.plantData.progress == 100,
			leaves: this.plantData.progress == 100 ? Math.max(Math.floor(Math.random() * this.plantData.activeSeed.leafiness), 2) : 0,
		};
		this.plantData.progress = 0;
		this.plantData.activeSeed = null;
		this.plantData.leaves += returnObject.leaves;
		return returnObject;
	}
	/**
	 * Renames the seed at index to name.
	 * @param {number} index - The index of the seed that should be renamed.
	 * @param {string} name - The new name for the seed.
	 * @return {Object}
	 */
	rename(index, name) {
		try {
			this.plantData.seeds[index].name = name;
			return {success: true};
		} catch (e) {
			return {success: false};
		}
	}
}

module.exports = Plant;
