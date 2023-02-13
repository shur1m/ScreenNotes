const { SlashCommandBuilder } = require('discord.js');

// WIP, allow attachments, links to images, links to messages

module.exports = {
	data: new SlashCommandBuilder()
		.setName('transcribe')
		.setDescription('transcribes images in a specific message')
        .addStringOption(option =>
			option
				.setName('message_link')
				.setDescription('link to message that you would like to transcribe')
			)
        ,
	async execute(interaction) {
		await interaction.reply(interaction.options.getString('message_link'));
	},
};