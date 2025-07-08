import { NextRequest, NextResponse } from 'next/server';
import { runProductExecutor } from '../../../executor';

// GET /api/test - test the executor with sample prompts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const prompt = searchParams.get('prompt') || 'show all products';
    
    const result = await runProductExecutor(prompt);
    
    return NextResponse.json({
      success: true,
      testPrompt: prompt,
      result
    });
  } catch (err: any) {
    return NextResponse.json({ 
      success: false,
      error: err.message
    }, { status: 500 });
  }
}