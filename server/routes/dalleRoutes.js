import express from 'express';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const router = express.Router();

async function getData(prompt) {
  const url = `https://image.pollinations.ai/prompt/${prompt}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error('Error fetching the data:', response.statusText);
      return null; 
    }

    // If the response is an image, return the buffer
    const buffer = await response.buffer(); 
    return buffer; 
  } catch (error) {
    console.error('An error occurred:', error);
    return null; 
  }
}


router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const imageBuffer = await getData(prompt);
    if (imageBuffer) {
      const base64Image = imageBuffer.toString('base64');
      res.status(200).json({ photo: `data:image/jpeg;base64,${base64Image}` });
    } else {
      res.status(404).send('Image not found.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response.data.error.message || 'Something went wrong');
  }
});

export default router;
