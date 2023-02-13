const { SlashCommandBuilder } = require('discord.js');
const toggles = require('./toggles.json');

/* WIP
*  - per channel settings
*/

//generate option for every togglecommand
function getToggleOptions() {
    let command = new SlashCommandBuilder();

    command.setName('settings')
        .setDescription('changes bot settings');

    for (toggle of toggles){
        command.addBooleanOption(option => 
            option.setName(toggle.varName)
                .setDescription(toggle.desc));
    }

    return command;
}

module.exports = {
	data: getToggleOptions(),
	async execute(interaction) {

        //change all variables
        for (toggle of toggles){
            const boolInput = interaction.options.getBoolean(toggle.varName);            
            if (boolInput !== null){
                console.log(`set ${toggle.varName} to ${boolInput}`);
                interaction.client.settings.set(interaction.guild.id, boolInput, toggle.varName);
            }
        }

        //respond to interaction
        await interaction.reply({content: 'settings changed', ephemeral: true});
        console.log(interaction.client.settings);
	},
};