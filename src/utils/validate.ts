import { productSchema } from '../schemas/product.schema';

export function validateProduct(input: any): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  for (const key in productSchema) {
    const rule = productSchema[key];
    const value = input[key];

    if (rule.required && (value === null || value === undefined)) {
      issues.push(`Missing required field: ${key}`);
    } else if (rule.type === 'number' && typeof value === 'number') {
      if (value < 0) {
        issues.push(`Field '${key}' cannot be negative`);
      }
    } else if (rule.type === 'string' && typeof value !== 'string' && value !== undefined && value !== null) {
      issues.push(`Field '${key}' should be a string`);
    } else if (rule.type === 'array' && !Array.isArray(value)) {
      issues.push(`Field '${key}' should be an array`);
    } else if (rule.type === 'boolean' && typeof value !== 'boolean') {
      issues.push(`Field '${key}' should be a boolean`);
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
