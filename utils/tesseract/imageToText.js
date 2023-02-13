const { createWorker } = require('tesseract.js');

module.exports = {
    async convertImageToText(link){
        const worker = await createWorker()
    
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(link);
        await worker.terminate();
        return text;
    }
}