const { SlashCommandBuilder } = require('discord.js');
const { getImageLinksFromMessage, transcribeImagesFromLinks, sendTranscription } = require('../utils/transcribeHelper');

// WIP allow options to delete and not delete original messages, etc
	// essentially port over the option generator, using the "outputoption" in toggles.json

module.exports = {
	data: new SlashCommandBuilder()
		.setName('transcribe')
		.setDescription('transcribes images in a specific message or link')
        .addStringOption(option =>
			option
				.setName('link')
				.setDescription('link to message/image to be transcribed')
				.setRequired(true)
			)
        ,
	async execute(interaction) {
		let linkOption = interaction.options.getString('link');
		let validFileFormats = ['.bmp', '.jpg', '.png', '.pbm', '.webp'];
		let imageLinks = [];

		// check if link is an image
		for (ext of validFileFormats){
			if (linkOption.endsWith(ext)){
				imageLinks.push(linkOption);
				break;
			}
		}

		// check if link is a discord message, if it does attempt to fetch images from message
		if (imageLinks.length == 0 && linkOption.includes('https://discord.com/')){
			let possibleIds = linkOption.split('/');
			let possibleMessageId;
			let possibleChannelId;

			if (possibleIds.length >= 3){
				possibleMessageId = possibleIds[possibleIds.length-1];
				possibleChannelId = possibleIds[possibleIds.length-2];
			}

			if (possibleMessageId){
				// try to fetch the message
				let message;

				try {
					// retrieve channel and message
					let channel = await interaction.client.channels.fetch(possibleChannelId);
					message = await channel.messages.fetch(possibleMessageId);

					// if we got the message, attempt to get links and place all in imagelinks
					imageLinks.push(...getImageLinksFromMessage(message));

				}
				catch (error) { console.error(error); }
			}
		}

		// using links, generate text and responses if we found image links
		if (imageLinks.length > 0){
			let  { outputImages, outputTexts } = await transcribeImagesFromLinks(imageLinks);
			await interaction.reply({content: 'I found your images. Give me a second...', ephemeral: true});
			
			for (let i = 0; i < outputImages.length; ++i){
				let messageParams = Object();
				messageParams.content = outputTexts[i];
				messageParams.files = [outputImages[i]];

				interaction.channel.send(messageParams);
			}

			return;	
		}
		
		await interaction.reply({content: 'Sorry, something went wrong. Make sure the link either contains an image, or links to a discord message with image(s). Also ensure that I have access to the link.', ephemeral: true});
	},
};