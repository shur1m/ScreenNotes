const { Attachment, AttachmentBuilder } = require('discord.js');
const convertImageToText = require('./tesseract/imageToText.js');
const evaluateToggle = require('./enmap/evaluateToggle.js');

//WIP if text too long, we should send it in multiple batches 

async function transcribeImage(client, message){
    let settings = client.settings;
    let guildid = message.guild.id;
    let channelid = message.channel.id;

    //ensure safe word is not in message and transcibe_all is true
    if (message.content.includes('donot') || !evaluateToggle('transcribe_all', settings, message))
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
            
            if (evaluateToggle('copy_image', settings, message))
                messageOptions.files = [image]

            await message.channel.send(messageOptions);
        }

        // delete original message
        if (message.deletable && evaluateToggle('delete_message', settings, message)){
            await message.delete();
        }
    }
}

module.exports = transcribeImage;