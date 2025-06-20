// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function suggestFixesForProduct(product: any): Promise<{ suggestions: Record<string, string> } | { error: string }> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
You are an intelligent assistant that reviews product data for issues.

Here is a product JSON object:
${JSON.stringify(product, null, 2)}

Your task is to return a JSON object where:
- The key is the field name that has a potential issue or improvement.
- The value is a brief suggestion or warning for the user.

Only include fields that require review (e.g., negative price, unrealistic quantity, missing optional values that are usually important, etc.)

Example response:
{
  "price": "Price should not be negative",
  "description": "Consider adding a product description for clarity"
}

Return only valid JSON. Do not include comments or explanations.
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const json = JSON.parse(text);

    if (typeof json !== 'object' || Array.isArray(json)) {
      return { error: 'Unexpected format from Gemini response.' };
    }

    return { suggestions: json };
  } catch (e: any) {
    return { error: `Failed to generate suggestions: ${e.message}` };
  }
}

export async function testGeminiPro() {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `Hi Gemini what model are you`;
  const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return text;
}
