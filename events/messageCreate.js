const { Events } = require('discord.js');
const evaluateToggle = require('../utils/enmap/evaluateToggle.js');
const { transcribeAndSendMessage } = require('../utils/transcribeHelper.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(client, message) {
        //ensure message is not created by bot
        if (message.author.id == client.user.id){
            return;
        }

        try {
            //ensure safe word is not in message and transcibe_all is true, then transcribe
            if (!message.content.includes('donot') &&
                evaluateToggle('transcribe_all', client.settings, message))
            {
                await transcribeAndSendMessage(client, message, message.channel);
            }   
        } catch (e) {
            console.error(e);

            //WIP respond something went wrong
         }
	},
};