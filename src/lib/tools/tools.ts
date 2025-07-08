import { PrismaClient } from '@prisma/client';
import { productSchema } from '../../schemas/product.schema';

const prisma = new PrismaClient();

export const productTools = {
  upsertProduct: async (data: any) => {
    try {
      const { id, ...rest } = data;
      const product = await prisma.product.upsert({
        where: { id: id || 0 }, // If id is not provided, use 0 (will create new)
        update: rest,
        create: rest,
      });
      return { success: true, product };
    } catch (error) {
      return { success: false, error };
    }
  },

  deleteProduct: async (id: number) => {
    try {
      const product = await prisma.product.delete({ where: { id } });
      return { success: true, product };
    } catch (error) {
      return { success: false, error };
    }
  },

  fetchProduct: async (id: number) => {
    try {
      const product = await prisma.product.findUnique({ where: { id } });
      return { success: true, product };
    } catch (error) {
      return { success: false, error };
    }
  },

  listProducts: async () => {
    try {
      const products = await prisma.product.findMany();
      return { success: true, products };
    } catch (error) {
      return { success: false, error };
    }
  },

  suggestProductFixes: (input: any, issues: string[]) => {
    const suggestions: Record<string, string> = {};
    for (const issue of issues) {
      if (issue.startsWith('Missing required field:')) {
        const field = issue.split(':')[1].trim();
        const rule = productSchema[field];
        suggestions[field] = `This field is required and should be of type ${rule.type}.`;
        if (rule.default !== undefined) {
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
  },
};
