const { Events } = require('discord.js');

module.exports = {
	name: Events.GuildDelete,
	async execute(client, guild) {
        //when bot is kicked or leaves, remove guild from settings
        client.settings.delete(guild.id);
	},
};