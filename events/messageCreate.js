const { Events, Attachment, AttachmentBuilder, MessageContextMenuCommandInteraction} = require('discord.js');
const { convertImageToText } = require('../utils/tesseract/imageToText.js');

async function transcribeImage(client, message){
    let settings = client.settings;
    let guildid = message.guild.id;

    //ensure safe word is not in message and doTranscribe is true
    if (message.content.includes('donot') ||
        !settings.get(guildid, 'transcribe'))
        return;

    // for every attachment (picture), grab the links of the images
    let imageLinks = [];
    for (entry of message.attachments.entries()){
        for (element of entry){
            if (element instanceof Attachment) 
                imageLinks.push(element.attachment);
        }
    }

    if (imageLinks.length > 0){
        // convert each image to text
        for (link of imageLinks){
            let imageText = await convertImageToText(link, 'eng');
            const image = new AttachmentBuilder(link);

            // generate response message
            messageOptions = Object();
            messageOptions.content = imageText;
            
            if (settings.get(guildid, 'copyimage'))
                messageOptions.files = [image]

            await message.channel.send(messageOptions);
        }

        // delete original message
        if (message.deletable && settings.get(guildid, 'deletemessage')){
            await message.delete();
        }
    }
}

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