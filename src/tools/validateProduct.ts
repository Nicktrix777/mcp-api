import { productSchema } from '../schemas/product.schema';
import { ExecutorContext, ExecutorResult } from '../executor';

export async function validateProductTool(context: ExecutorContext): Promise<ExecutorResult> {
  const { data } = context.input;
  
  if (!data) {
    return {
      tool: 'validateProduct',
      output: { 
        success: false, 
        error: 'No product data provided for validation' 
      }
    };
  }

  const issues: string[] = [];
  const validatedData: any = {};

  // Validate each field against the schema
  for (const [field, config] of Object.entries(productSchema)) {
    const value = data[field];
    
    if (config.required && (value === undefined || value === null || value === '')) {
      issues.push(`Missing required field: ${field}`);
    } else if (value !== undefined && value !== null) {
      // Type validation
      if (config.type === 'string' && typeof value !== 'string') {
        issues.push(`Field '${field}' should be a string`);
      } else if (config.type === 'number' && typeof value !== 'number') {
        issues.push(`Field '${field}' should be a number`);
      } else if (config.type === 'boolean' && typeof value !== 'boolean') {
        issues.push(`Field '${field}' should be a boolean`);
      } else if (config.type === 'array' && !Array.isArray(value)) {
        issues.push(`Field '${field}' should be an array`);
      }
      
      // Additional validations
      if (config.type === 'number' && value < 0) {
        issues.push(`Field '${field}' cannot be negative`);
      }
      
      validatedData[field] = value;
    } else if ('default' in config && config.default !== undefined) {
      validatedData[field] = config.default;
    }
  }

  if (issues.length > 0) {
    return {
      tool: 'validateProduct',
      output: {
        success: false,
        issues,
        suggestions: await getValidationSuggestions(data, issues),
        data: validatedData
      }
    };
  }

  return {
    tool: 'validateProduct',
    output: {
      success: true,
      data: validatedData
    },
    nextTool: context.input.action === 'create' ? 'insertProduct' : undefined
  };
}

async function getValidationSuggestions(data: any, issues: string[]): Promise<Record<string, string>> {
  const suggestions: Record<string, string> = {};
  
  for (const issue of issues) {
    if (issue.startsWith('Missing required field:')) {
      const field = issue.split(':')[1].trim();
      const rule = productSchema[field];
      suggestions[field] = `This field is required and should be of type ${rule.type}.`;
      if ('default' in rule && rule.default !== undefined) {
        suggestions[field] += ` Default: ${JSON.stringify(rule.default)}`;
      }
    } else if (issue.includes('should be a string')) {
      const match = issue.match(/Field '(.+)' should be a string/);
      if (match) {
        const field = match[1];
        suggestions[field] = 'Provide a valid string value.';
      }
    } else if (issue.includes('should be an array')) {
      const match = issue.match(/Field '(.+)' should be an array/);
      if (match) {
        const field = match[1];
        suggestions[field] = 'Provide an array value (e.g., []).';
      }
    } else if (issue.includes('should be a boolean')) {
      const match = issue.match(/Field '(.+)' should be a boolean/);
      if (match) {
        const field = match[1];
        suggestions[field] = 'Provide a boolean value (true or false).';
      }
    } else if (issue.includes('cannot be negative')) {
      const match = issue.match(/Field '(.+)' cannot be negative/);
      if (match) {
        const field = match[1];
        suggestions[field] = 'Provide a non-negative number.';
      }
    }
  }
  
  return suggestions;
} 