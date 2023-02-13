const { SlashCommandBuilder, ChannelType } = require('discord.js');
const toggles = require('./toggles.json');

// WIP
// remove console logs
// allow user to set "safe word"
// allow to change language
// allow to remove all whitespace
// allow removal of all newlines

//generate option for every togglecommand
function getBaseCommand() {
    let command = new SlashCommandBuilder();

    // basic command
    command.setName('settings')
        .setDescription('changes bot settings');

    // add options for each toggle
    for (toggle of toggles){
        command.addBooleanOption(option => 
            option.setName(toggle.varName)
                .setDescription(toggle.desc));
    }

    // add options for selecting channel
    command.addChannelOption(option =>
        option.setName('channel')
            .setDescription('change channel settings')
            .addChannelTypes(ChannelType.GuildText));

    return command;
}

module.exports = {
	data: getBaseCommand(),
	async execute(interaction) {

        //if there was a channel option, change path to channel instead
        let channel = interaction.options.getChannel('channel')
        let path = '';
        if (channel !== null){
            path = ['channel_settings', channel.id].join('.') + '.';
        }

        //change all variables
        for (toggle of toggles){
            const boolInput = interaction.options.getBoolean(toggle.varName);    

            if (boolInput !== null){
                interaction.client.settings.set(
                    interaction.guild.id,
                    boolInput,
                    path + toggle.varName);
            }
        }

        //respond to interaction
        await interaction.reply({content: 'settings changed', ephemeral: true});
        console.log(interaction.client.settings);
        console.log(interaction.client.settings.get(interaction.guild.id, 'channel_settings'));
	},
};