import { runProductExecutor } from '../executor/index';
import { Product } from '../schemas/product.schema';

// Main handler for product prompts - uses AI to parse and execute
export async function handleProductPrompt(prompt: string): Promise<any> {
  try {
    const result = await runProductExecutor(prompt);
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      action: 'error'
    };
  }
}

// Handler for structured product queries
export async function handleProductQuery(query: Record<string, string>): Promise<any> {
  try {
    // Convert query object to a natural language prompt for the executor
    const queryParts = Object.entries(query).map(([key, value]) => `${key}: ${value}`);
    const prompt = `show products with ${queryParts.join(', ')}`;
    
    const result = await runProductExecutor(prompt);
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      action: 'error'
    };
  }
}

// Unified handler for all product operations
export async function handleProductRequest(
  method: 'GET' | 'POST',
  data: any
): Promise<any> {
  try {
    if (method === 'POST') {
      // Handle natural language prompts
      return await handleProductPrompt(data.prompt);
    } else if (method === 'GET') {
      // Handle structured queries
      return await handleProductQuery(data);
    }
    
    throw new Error('Unsupported method');
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      action: 'error'
    };
  }
} 