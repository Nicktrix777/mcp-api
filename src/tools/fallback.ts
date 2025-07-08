import { ExecutorContext, ExecutorResult } from '../executor';

export async function fallbackTool(context: ExecutorContext): Promise<ExecutorResult> {
  const { intent, originalPrompt } = context.input;
  
  return {
    tool: 'fallback',
    output: {
      success: false,
      error: 'Unrecognized request or action',
      message: 'I could not understand your request. Please try rephrasing it.',
      originalPrompt,
      intent,
      suggestions: [
        'Try: "add a product called milk with price 20 and quantity 100"',
        'Try: "update product 5 to have price 25"',
        'Try: "delete product 3"',
        'Try: "show all products"',
        'Try: "list products in category 1"'
      ]
    }
  };
} 