const { SlashCommandBuilder } = require('discord.js');

// generates do/donot toggle command depending on whether positive is true or false
// desc is what the variable represents

function generateToggleCommand(varName, positive, desc){
	// string manipulation
	varName = varName.toLowerCase()
	let commandName = `${positive ? 'do' : 'donot'}${varName}`;

	return {
		data: new SlashCommandBuilder()
			.setName(commandName)
			.setDescription(`turns ${desc} ${positive ? 'on' : 'off'} for this server`),
		async execute(interaction) {
			let client = interaction.client;
			
			// toggle variable in settings
			client.settings.set(interaction.guild.id, positive, varName);

			// reply to interaction
			let textResponse =  `${desc} has been turned **${positive ? 'ON' : 'OFF'}** for this server.`;
			interaction.reply({content: textResponse, ephemeral: true});
		},
	};
}

module.exports = { generateToggleCommand }