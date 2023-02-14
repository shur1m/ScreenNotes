const { SlashCommandBuilder, ChannelType } = require('discord.js');

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

        .addSubcommand(subcommand => 
            subcommand.setName('server')
                .setDescription('clear settings for entire server'))
                
        .addSubcommand(subcommand =>
            subcommand.setName('dm')
                .setDescription('clear settings for direct messages')),

	async execute(interaction) {
        //if channel clear
        let subcommand = interaction.options.getSubcommand();
        if (subcommand == 'channel'){
            let channelOption = interaction.options.getChannel('channel');
            let channelPath = `channel_settings.${channelOption.id}`;

            if (interaction.client.settings.has(interaction.guild.id, channelPath))
                interaction.client.settings.delete(interaction.guild.id, channelPath);

            await interaction.reply({content: `Settings for <#${channelOption.id}> cleared.`, ephemeral: true});
        }

        // if server clear
        else if (subcommand == 'server') { 
            interaction.client.settings.delete(interaction.guild.id);
            await interaction.reply({content: 'Server Settings cleared.', ephemeral: true});
        }

        // if dm clear
        else if (subcommand == 'dm') {
            interaction.client.settings.delete(interaction.user.id);
            await interaction.reply({content: `Direct message settings for ${interaction.user.username} cleared.`, ephemeral: true});
        }
	},
};