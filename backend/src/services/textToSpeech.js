// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
const { resolve } = require('path');

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

async function convert(text) {
  // // The text to synthesize
  // const text = 'hey bich!';

  // Construct the request
  const request = {
    input: {text: text},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'fr-FR', ssmlGender: 'NEUTRAL'},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile('tmp/output.mp3', response.audioContent, 'binary');
  console.log('Audio content written to file: output.mp3');
}

module.exports = {
  convert
}