const {Command} = require('discord.js-commando');
const music = require('../../utils/models/music.js');

module.exports = class ResumeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'resume',
			group: 'music',
			memberName: 'resume',
			description: 'resumes the current music.',
			details: 'resumes the current music.',
			examples: ['resume'],
			format: '',
			guildOnly: true,
		});
	}

	async run(msg) {
		music.resume(msg);
	}
};
