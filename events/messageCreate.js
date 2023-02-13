const { Events } = require('discord.js');
const transcribeImage = require('../utils/transcribeImage.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(client, message) {
        //ensure message is not created by bot
        if (message.author.id == client.user.id){
            return;
        }

        transcribeImage(client, message)
            .catch((error) => {
            console.error(error);
        });
	},
};