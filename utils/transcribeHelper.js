const { Attachment, AttachmentBuilder } = require('discord.js');
const convertImageToText = require('./tesseract/imageToText.js');
const evaluateToggle = require('./enmap/evaluateToggle.js');

//WIP if text too long, we should send it in multiple batches 

//client for settings
//message for images
//output channel for bot output/transcription
//imagelinks for extra images

//given a message, returns the images and the transcribed texts
async function transcribeMessage(message){
    // for every attachment (picture) in message, grab the links of the images
    let imageLinks = getImageLinksFromMessage(message);
    
    //return object of images and texts
    result = await transcribeImagesFromLinks(imageLinks)
    result.message = message;
    return result;
}

// grabs attachment links from message
function getImageLinksFromMessage(message) {
    let imageLinks = [];
    for (entry of message.attachments.entries()){
        for (element of entry){
            if (element instanceof Attachment) 
            imageLinks.push(element.attachment);
        }
    }

    return imageLinks;
}

// given links, generates transcriptions
async function transcribeImagesFromLinks(imageLinks){
    //generate images and text
    let outputImages = [];
    let outputTexts = [];
    
    if (imageLinks.length > 0){
        // convert each image to text
        for (link of imageLinks){
            let outputText = await convertImageToText(link, 'eng');
            const image = new AttachmentBuilder(link);
            
            // add to output
            outputImages.push(image);
            outputTexts.push(outputText);
            
        }
    }

    return { outputImages, outputTexts };
}

//given client transcriptions, and output, formats and sends response into output
async function sendTranscription(client, transcriptions, outputChannel) {

    let settings = client.settings;
    let message = transcriptions.message;
    let { outputImages, outputTexts } = transcriptions;
    
    // generate response message
    for (let i = 0; i < outputImages.length; ++i){
        messageOptions = Object();
        messageOptions.content = outputTexts[i];
        if (evaluateToggle('copy_image', settings, message))
            messageOptions.files = [outputImages[i]]
    
        await outputChannel.send(messageOptions);
        
        // delete original message
        if (message.deletable && evaluateToggle('delete_message', settings, message)){
            await message.delete();
        }
    }
}

async function transcribeAndSendMessage(client, message, outputChannel){
    await sendTranscription(client, await transcribeMessage(message), outputChannel);
}

module.exports = {
    sendTranscription,
    transcribeMessage,
    transcribeAndSendMessage,
    getImageLinksFromMessage,
    transcribeImagesFromLinks,
};