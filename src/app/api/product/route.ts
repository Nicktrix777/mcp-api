import { NextRequest, NextResponse } from 'next/server';
import { handleProductPrompt, handleProductQuery } from '../../../handlers/productHandler';
// POST /api/product - create/update product from prompt
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return NextResponse.json({ 
        success: false, 
        error: 'Prompt is required' 
      }, { status: 400 });
    }
    
    const result = await handleProductPrompt(prompt);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ 
      success: false,
      error: err.message,
      action: 'error'
    }, { status: 500 });
  }
}

// GET /api/product - view all products with dynamic query
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      query[key] = value;
    });
    
    const result = await handleProductQuery(query);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ 
      success: false,
      error: err.message,
      action: 'error'
    }, { status: 500 });
  }
} 