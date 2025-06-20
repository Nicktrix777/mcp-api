// src/lib/tools/tools.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const productTools = {
  addProduct: async (data: any) => {
    try {
      const product = await prisma.product.create({ data });
      return { success: true, product };
    } catch (error) {
      return { success: false, error };
    }
  },

  updateProduct: async (id: number, data: any) => {
    try {
      const product = await prisma.product.update({
        where: { id },
        data,
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
};
