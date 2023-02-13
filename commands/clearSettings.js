const { SlashCommandBuilder, ChannelType } = require('discord.js');

// clears settings for entire server, or just one channel
// WIP create separate subcommand for server and channel

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear_settings')
		.setDescription('delete channel settings or reset all settings in server')

        .addSubcommand(subcommand =>
            subcommand.setName('channel')
            .setDescription('clear settings for specific channel')
            .addChannelOption(option =>
                option.setName('channel')
                    .setDescription('channel to clear settings from')
                    .setRequired(true)
                    .addChannelTypes(ChannelType.GuildText)))

        .addSubcommand(subcommand => (
            subcommand.setName('server')
                .setDescription('clear settings for entire server'))),

	async execute(interaction) {
        //if channel clear
        if (interaction.options.getSubcommand() == 'channel'){
            let channelOption = interaction.options.getChannel('channel');
            let channelPath = `channel_settings.${channelOption.id}`;

            if (interaction.client.settings.has(interaction.guild.id, channelPath))
                interaction.client.settings.delete(interaction.guild.id, channelPath);
                
            await interaction.reply({content: `Settings for <#${channelOption.id}> cleared.`, ephemeral: true});
        }

        // if server clear
        else { 
            interaction.client.settings.delete(interaction.guild.id);
            await interaction.reply({content: 'Server Settings reset.', ephemeral: true});
        }
	},
};