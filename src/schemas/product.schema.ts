export const productSchema = {
    name: { type: 'string', required: true },
    price: { type: 'number', required: true },
    quantity: { type: 'number', required: true },
    categoryId: { type: 'number', required: true },
    supplierId: { type: 'number', required: true },
    description: { type: 'string', required: false, default: '' },
    tags: { type: 'array', required: false, default: [] },
    isAvailable: { type: 'boolean', required: false, default: true },
  };

export type Product = {
  id: number;
  name: string;
  price: number;
  stock?: number;
  description?: string;
};
  