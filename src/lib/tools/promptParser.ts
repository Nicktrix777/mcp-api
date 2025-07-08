import { GoogleGenerativeAI } from '@google/generative-ai';
import { productSchema } from '../../schemas/product.schema';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ParsedProductData {
  action: 'create' | 'update' | 'delete' | 'query';
  data?: any;
  filters?: any;
  id?: number;
}

export async function parseProductPrompt(prompt: string): Promise<ParsedProductData> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const schemaDescription = Object.entries(productSchema)
    .map(([field, config]) => `${field}: ${config.type}${config.required ? ' (required)' : ' (optional)'}`)
    .join(', ');

  const systemPrompt = `
You are a product data parser. Extract structured product information from natural language prompts.

Product Schema: ${schemaDescription}

Actions to detect:
- CREATE: "add product", "create product", "new product"
- UPDATE: "update product", "modify product", "change product"
- DELETE: "delete product", "remove product"
- QUERY: "show products", "list products", "find products", "get products"

Return a JSON object with:
{
  "action": "create|update|delete|query",
  "data": { /* product fields for create/update */ },
  "filters": { /* query filters */ },
  "id": number /* for update/delete operations */
}

Examples:
- "add a product called milk with price 20 and quantity 100" → {"action": "create", "data": {"name": "milk", "price": 20, "quantity": 100}}
- "update product 5 to have price 25" → {"action": "update", "id": 5, "data": {"price": 25}}
- "delete product 3" → {"action": "delete", "id": 3}
- "show all products" → {"action": "query", "filters": {}}

Return only valid JSON. No explanations.
`;

  try {
    const result = await model.generateContent(`${systemPrompt}\n\nUser prompt: ${prompt}`);
    const text = result.response.text().trim();
    
    // Clean up the response to extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate the parsed structure
    if (!['create', 'update', 'delete', 'query'].includes(parsed.action)) {
      throw new Error('Invalid action in parsed data');
    }
    
    return parsed;
  } catch (error: any) {
    throw new Error(`Failed to parse prompt: ${error.message}`);
  }
}

export async function suggestProductFixes(product: any): Promise<Record<string, string>> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
Review this product data and suggest improvements:

${JSON.stringify(product, null, 2)}

Product Schema: ${Object.entries(productSchema)
  .map(([field, config]) => `${field}: ${config.type}${config.required ? ' (required)' : ' (optional)'}`)
  .join(', ')}

Return a JSON object where keys are field names and values are suggestions:
{
  "fieldName": "suggestion text"
}

Only include fields that need attention. Return only valid JSON.
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return {};
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    return {};
  }
} 