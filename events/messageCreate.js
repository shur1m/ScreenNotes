const { Events, Attachment, AttachmentBuilder} = require('discord.js');
const { convertImageToText } = require('../utils/tesseract/imageToText.js');

async function transcribeImage(message){

    //ensure safe word is not in message
    if (!message.content.includes('donot')){
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
                let imageText = await convertImageToText(link);
                const image = new AttachmentBuilder(link);
                await message.channel.send({content: imageText, files: [image]});
            }

            if (message.deletable){
                await message.delete();
            }
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

        transcribeImage(message)
            .catch((error) => {
            console.error(error);
        });
	},
};