
import { callModel } from "./modelRegistry";
import { tools, toolMetadata } from "../lib/tools";
import { parseProductPrompt, ParsedProductData } from "../lib/tools/promptParser";

// Type definitions
export type ExecutorContext = {
  input: any;
  history: ExecutorResult[];
};

export type ExecutorResult = {
  tool: string;
  output: any;
  nextTool?: string;
};

export type Tool = (context: ExecutorContext) => Promise<ExecutorResult>;

// Dynamic execution engine
export async function executeChain(
  initialInput: any,
  initialTool: string,
  maxSteps = 10
): Promise<ExecutorResult[]> {
  let context: ExecutorContext = { input: initialInput, history: [] };
  let currentTool: string | undefined = initialTool;
  let steps = 0;

  while (currentTool && steps < maxSteps) {
    const tool = tools[currentTool];
    if (!tool) throw new Error(`Tool not found: ${currentTool}`);
    const result = await tool(context);
    context.history.push(result);
    // Allow tool to suggest next tool, or stop if none
    currentTool = result.nextTool || undefined;
    steps++;
  }

  return context.history;
}

// Dynamic tool selection based on parsed prompt
export async function selectToolForAction(parsedData: ParsedProductData): Promise<string> {
  switch (parsedData.action) {
    case 'create':
      return 'validateProduct'; // First validate, then insert
    case 'update':
      return 'upsertProduct';
    case 'delete':
      return 'deleteProduct';
    case 'query':
      return 'listProducts';
    default:
      return 'fallback';
  }
}

// Main executor function that handles product prompts
export async function runProductExecutor(userPrompt: string) {
  try {
    // Step 1: Parse the user prompt to extract structured data
    const parsedData = await parseProductPrompt(userPrompt);
    
    // Step 2: Select the appropriate tool based on the action
    const selectedTool = await selectToolForAction(parsedData);
    
    // Step 3: Execute the tool chain
    const results = await executeChain(
      { 
        ...parsedData,
        originalPrompt: userPrompt 
      },
      selectedTool,
      5 // Max 5 steps for product operations
    );
    
    // Step 4: Return the final result
    const finalResult = results[results.length - 1];
    
    return {
      success: true,
      action: parsedData.action,
      result: finalResult?.output,
      steps: results.length,
      toolChain: results.map(r => r.tool)
    };
    
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      action: 'error'
    };
  }
}

// Enhanced executor for complex operations
export async function runExecutor(userPrompt: string) {
  const intent = await callModel(userPrompt); // Gemini/OpenAI, etc.

  switch (intent.action) {
    case "validate_product":
      return await validateProductTool(intent.data);
    case "insert_product":
      return await insertProductTool(intent.data);
    default:
      return await fallbackTool(intent);
  }
}
