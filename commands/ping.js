const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('replies with pong'),
	async execute(interaction) {
        console.log(interaction.inGuild());
        if (interaction.channel){
            await interaction.reply('pong! this is a guild channel!')
        }

        else if (interaction.user){
            await interaction.reply('pong! this was a dm!')
            console.log(interaction.user.id);
        }
	},
};