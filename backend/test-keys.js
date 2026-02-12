import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function testGemini() {
    console.log('--- Testing Gemini ---');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.log('❌ Gemini API key missing in .env');
        return;
    }
    console.log(`Using Gemini Key: ${apiKey.substring(0, 5)}...`);
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hi");
        console.log('✅ Gemini Success:', result.response.text().substring(0, 50) + '...');
    } catch (error) {
        console.log('❌ Gemini Failed:', error.message);
    }
}

async function testOpenAI() {
    console.log('\n--- Testing OpenAI ---');
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.log('❌ OpenAI API key missing in .env');
        return;
    }
    console.log(`Using OpenAI Key: ${apiKey.substring(0, 5)}...`);
    try {
        const openai = new OpenAI({ apiKey });
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Hi" }],
        });
        console.log('✅ OpenAI Success:', response.choices[0].message.content.substring(0, 50) + '...');
    } catch (error) {
        console.log('❌ OpenAI Failed:', error.message);
    }
}

console.log('Starting API Key Validation...');
console.log('Current Directory:', process.cwd());

try {
    await testGemini();
} catch (e) {
    console.error('Gemini test crashed:', e.message);
}

try {
    await testOpenAI();
} catch (e) {
    console.error('OpenAI test crashed:', e.message);
}
