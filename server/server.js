import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


const app = express();
app.use(cors());
app.use(express.json());
  

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from ThirdBrain',
    })
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        console.log('Received prompt:', prompt);

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        if (response && response.choices) {
            const botText = response.choices[0].message.content;
            res.status(200).send({
                bot: botText
            });
        } else {
            console.error('Invalid or unexpected API response:', response);
            res.status(500).send({
                error: 'Invalid API response'
            });
        }
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send({ error });
    }
});

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));