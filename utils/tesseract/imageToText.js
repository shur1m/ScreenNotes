const { createWorker } = require('tesseract.js');

module.exports = {
    async convertImageToText(link, language){
        const worker = await createWorker()
    
        //load language and detect text
        await worker.loadLanguage(language);
        await worker.initialize(language);
        const { data: { text } } = await worker.recognize(link);
        await worker.terminate();
        return text;
    }
}