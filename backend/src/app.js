const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/textToSpeech", (request, response) => {
  const { url, title, techs } = request.body;
  
  console.log('aqui', url, title, techs);
  return response.json(repositories);
});

module.exports = app;
