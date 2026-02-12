import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return console.log('❌ Missing Gemini Key');

    console.log('--- Listing Available Gemini Models ---');
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // We can't easily list models with the simple SDK without a fetch call to the discovery API,
        // but we can try common names.
        const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.0-pro'];

        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hi");
                console.log(`✅ ${modelName}: WORKED!`);
                return modelName;
            } catch (e) {
                console.log(`❌ ${modelName}: FAILED - ${e.message}`);
            }
        }
    } catch (error) {
        console.log('❌ Discovery Failed:', error.message);
    }
}

listModels();
