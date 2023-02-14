const { SlashCommandBuilder } = require('discord.js');

// WIP, allow attachments, links to images, links to messages

module.exports = {
	data: new SlashCommandBuilder()
		.setName('transcribe')
		.setDescription('transcribes images in a specific message')
        .addStringOption(option =>
			option
				.setName('link')
				.setDescription('link to message/image that you would like to transcribe')
				.setRequired(true)
			)
        ,
	async execute(interaction) {
		await interaction.reply(interaction.options.getString('link'));
	},
};