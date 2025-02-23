import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const testEnv = {
    baseURL:  process.env.BASE_URL, // Fallback URL if not provided
    pytadURL: process.env.PYTAD_URL,
    pytadAPIKey: process.env.PYTAD_API_KEY
};