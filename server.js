const textToSpeech = require('@google-cloud/text-to-speech');
require('dotenv').config();
const fs = require('fs');
const util = require('util');
const express = require('express');
const uuid = require('uuid');
const path = require('path');
const mime = require('mime');

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const client = new textToSpeech.TextToSpeechClient();

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  res.sendFile(filePath);
});

app.get('/synthesize', (req, res) => {
  res.send('Text-to-Speech API is ready to receive POST requests.');
});

app.post('/synthesize', async (req, res) => {
  try {
    const { text, playbackSpeed, voiceGender, voice } = req.body;

    const request = {
      input: { text },
      voice: { languageCode: 'en-US', name: voice, ssmlGender: voiceGender },
      audioConfig: { audioEncoding: 'MP3', speakingRate: parseFloat(playbackSpeed) },
    };

    const [response] = await client.synthesizeSpeech(request);

    const filename = `${uuid.v4()}.mp3`;

    const writeFile = util.promisify(fs.writeFile);
    await writeFile(filename, response.audioContent, 'binary');

    console.log('Audio content written to file:', filename);

    const audioFileUrl = `http://localhost:3000/${filename}`;
    res.status(200).json({ message: 'Text synthesis completed.', audioFileUrl });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred during text synthesis.' });
  }
});


app.get('/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, filename);
  const fileMime = mime.getType(filePath);

  res.setHeader('Content-Type', fileMime);
  res.sendFile(filePath);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
