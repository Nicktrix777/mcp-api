// // app/api/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { createProduct } from '../../../src/lib/tools';
// import { testGeminiPro, validateAndCompleteProduct } from '../../../src/lib/gemini';


// export async function POST(req: NextRequest) {
//   const input = await req.json();

//   const validated = await validateAndCompleteProduct(input);

//   if (validated.error) {
//     return NextResponse.json({ error: validated.error }, { status: 400 });
//   }

//   const result = await createProduct(validated);

//   if (result.error) {
//     return NextResponse.json({ error: result.error }, { status: 500 });
//   }

//   return NextResponse.json({ success: true, product: result });
// }