# MCP API - Product Management System

A Next.js-based API that uses AI to dynamically parse natural language prompts and execute product management operations.

## Features

- **AI-Powered Prompt Parsing**: Uses Gemini AI to convert natural language to structured product data
- **Dynamic Tool Selection**: Automatically selects the appropriate tools based on the parsed action
- **Schema Validation**: Validates product data against predefined schemas
- **Database Integration**: Uses Prisma with PostgreSQL for data persistence
- **Error Handling**: Comprehensive error handling with helpful suggestions

## API Endpoints

### POST /api/product
Create or update products using natural language prompts.

**Request:**
```json
{
  "prompt": "add a product called milk with price 20 and quantity 100"
}
```

**Response:**
```json
{
  "success": true,
  "action": "create",
  "result": {
    "success": true,
    "product": { ... },
    "message": "Product created successfully"
  },
  "steps": 2,
  "toolChain": ["validateProduct", "insertProduct"]
}
```

### GET /api/product
Query products with structured parameters.

**Request:**
```
GET /api/product?categoryId=1&isAvailable=true
```

**Response:**
```json
{
  "success": true,
  "action": "query",
  "result": {
    "success": true,
    "products": [...]
  }
}
```

### GET /api/test
Test the executor with custom prompts.

**Request:**
```
GET /api/test?prompt=add a product called bread with price 15
```

## Supported Actions

The system can understand and execute these types of requests:

### Create Products
- "add a product called [name] with price [price] and quantity [quantity]"
- "create a new product [name] costing [price]"
- "add [name] to inventory with [details]"

### Update Products
- "update product [id] to have price [newPrice]"
- "modify product [id] with [changes]"
- "change [field] of product [id] to [value]"

### Delete Products
- "delete product [id]"
- "remove product [id] from inventory"

### Query Products
- "show all products"
- "list products in category [id]"
- "find products with [criteria]"

## Architecture

### Executor System
The core of the system is the `runProductExecutor` function that:

1. **Parses Prompts**: Uses AI to extract structured data from natural language
2. **Selects Tools**: Dynamically chooses the appropriate tools based on the action
3. **Executes Chain**: Runs a series of tools in sequence
4. **Returns Results**: Provides detailed results with success/failure status

### Tool Registry
Tools are organized in a registry for dynamic selection:

- `validateProduct`: Validates data against schema
- `insertProduct`: Inserts validated data into database
- `upsertProduct`: Creates or updates products
- `deleteProduct`: Removes products
- `listProducts`: Queries products with filters
- `fallback`: Handles unrecognized requests

### Schema Validation
Products are validated against a predefined schema:

```typescript
{
  name: { type: 'string', required: true },
  price: { type: 'number', required: true },
  quantity: { type: 'number', required: true },
  categoryId: { type: 'number', required: true },
  supplierId: { type: 'number', required: true },
  description: { type: 'string', required: false, default: '' },
  tags: { type: 'array', required: false, default: [] },
  isAvailable: { type: 'boolean', required: false, default: true }
}
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   DATABASE_URL=your_postgresql_connection_string
   ```

3. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Error Handling

The system provides detailed error messages and suggestions:

- **Validation Errors**: Lists specific field issues with suggestions
- **AI Parsing Errors**: Handles malformed prompts gracefully
- **Database Errors**: Provides clear database operation feedback
- **Tool Selection Errors**: Falls back to helpful error messages

## Testing

Use the test endpoint to verify functionality:

```bash
# Test product creation
curl "http://localhost:3000/api/test?prompt=add%20a%20product%20called%20milk%20with%20price%2020"

# Test product query
curl "http://localhost:3000/api/test?prompt=show%20all%20products"
``` 