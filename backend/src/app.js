const express = require("express");
const cors = require("cors");
const { convert } = require('./services/textToSpeech');
const { resolve } = require('path');

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  '/files',
  express.static(resolve(__dirname, '..', 'tmp'))
);

app.get("/textToSpeech", async (request, response) => {
  const { text } = request.query;
  console.log(text);
  if (!text) {
    return response.status(400).json({ error: 'Invalid text' });
  };

  await convert(text);
  console.log('aqui');
  return response.json('output.mp3');
});

module.exports = app;
