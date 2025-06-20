import { NextResponse } from "next/server";
import { testGeminiPro } from "../../../src/lib/gemini";

export async function GET(){
    const result = await testGeminiPro();
  return NextResponse.json({success: true, result: result});
}