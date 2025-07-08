import { ExecutorContext, ExecutorResult } from '../executor';
import { tools } from '../lib/tools';

export async function insertProductTool(context: ExecutorContext): Promise<ExecutorResult> {
  const { data } = context.input;
  
  if (!data) {
    return {
      tool: 'insertProduct',
      output: { 
        success: false, 
        error: 'No validated product data provided for insertion' 
      }
    };
  }

  try {
    // Use the upsertProduct tool from the tools registry
    const result = await tools.upsertProduct(data);
    
    if (result.success) {
      return {
        tool: 'insertProduct',
        output: {
          success: true,
          product: result.product,
          message: 'Product created successfully'
        }
      };
    } else {
      return {
        tool: 'insertProduct',
        output: {
          success: false,
          error: result.error,
          message: 'Failed to create product'
        }
      };
    }
  } catch (error: any) {
    return {
      tool: 'insertProduct',
      output: {
        success: false,
        error: error.message,
        message: 'Database operation failed'
      }
    };
  }
} 