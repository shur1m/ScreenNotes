const { SlashCommandBuilder, ChannelType } = require('discord.js');
const toggles = require('./toggles.json');

// WIP
// remove console logs
// allow user to set "safe word"
// allow to change language
// allow to remove all whitespace
// allow removal of all newlines

//generate option for every togglecommand
function addToggles(command) {
    // add options for each toggle
    for (toggle of toggles){
        command.addBooleanOption(option => 
            option.setName(toggle.varName)
                .setDescription(toggle.desc));
    }

    return command;
}

module.exports = {
	data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('changes bot\'s settings')

        // change settings for text channel within guild
        .addSubcommand(subcommand => {
            subcommand
                .setName('text_channel')
                .setDescription('settings for specific text channel')
                // add options for selecting channel
                .addChannelOption(option =>
                    option.setName('channel')
                    .setDescription('change channel settings')
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true))
            addToggles(subcommand)
            return subcommand })
            
        // change settings for entire guild
        .addSubcommand(subcommand => 
            addToggles(subcommand)
                .setName('server')
                .setDescription('settings for entire server'))
        
        // change settings for dms
        .addSubcommand(subcommand =>
            addToggles(subcommand)
                .setName('dm')
                .setDescription('settings for direct messages with bot')),

	async execute(interaction) {
        let subcommand = interaction.options.getSubcommand();

        let settingsKey;
        let path;

        // prevent server commands from being sent in dms
        if (subcommand != 'dm' && !interaction.inGuild()){
            interaction.reply({
                content: 'This command cannot be run in direct messages.',
                ephemeral: true
            });

            return;
        }

        //if server subcommand change server settings
        if (subcommand == 'server'){
            settingsKey = interaction.guild.id;
        }

        //if channel subcommand change channel settings
        if (subcommand == 'text_channel'){
            settingsKey = interaction.guild.id;
            let channel = interaction.options.getChannel('channel')
            path = ['channel_settings', channel.id].join('.') + '.';
        }

        //if dm subcommand change dm settings
        if (subcommand == 'dm'){
            settingsKey = interaction.user.id;
        }

        if (path === undefined)
            path = String();

        //change all variables
        for (toggle of toggles){
            const boolInput = interaction.options.getBoolean(toggle.varName);    

            if (boolInput !== null){
                interaction.client.settings.set(
                    settingsKey,
                    boolInput,
                    path + toggle.varName);
            }
        }

        //respond to interaction
        await interaction.reply({content: 'settings changed', ephemeral: true});
        console.log(interaction.client.settings);
	},
};