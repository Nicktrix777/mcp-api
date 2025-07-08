import { productTools } from './tools';
import { parseProductPrompt, suggestProductFixes } from './promptParser';

// Export all tools for dynamic selection
export const tools = {
  // Product CRUD operations
  upsertProduct: productTools.upsertProduct,
  deleteProduct: productTools.deleteProduct,
  fetchProduct: productTools.fetchProduct,
  listProducts: productTools.listProducts,
  
  // Validation and processing

  suggestFixes: suggestProductFixes,
  parseProductPrompt,
  
  // Fallback
};

// Tool metadata for dynamic selection
export const toolMetadata = {
  upsertProduct: {
    description: 'Create or update a product in the database',
    requiredFields: ['name', 'price', 'quantity', 'categoryId', 'supplierId'],
    optionalFields: ['description', 'tags', 'isAvailable'],
  },
  deleteProduct: {
    description: 'Delete a product by ID',
    requiredFields: ['id'],
  },
  fetchProduct: {
    description: 'Fetch a single product by ID',
    requiredFields: ['id'],
  },
  listProducts: {
    description: 'List all products with optional filtering',
    requiredFields: [],
    optionalFields: ['categoryId', 'supplierId', 'isAvailable'],
  },
  validateProduct: {
    description: 'Validate product data against schema',
    requiredFields: ['data'],
  },
  insertProduct: {
    description: 'Insert a new product after validation',
    requiredFields: ['data'],
  },
  suggestFixes: {
    description: 'Suggest fixes for product validation issues',
    requiredFields: ['product'],
  },
  parseProductPrompt: {
    description: 'Parse natural language prompt to structured product data',
    requiredFields: ['prompt'],
  },
  fallback: {
    description: 'Handle unrecognized requests',
    requiredFields: ['intent'],
  },
};