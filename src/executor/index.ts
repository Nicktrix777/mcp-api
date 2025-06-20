import { validateProductTool } from "../tools/validateProduct";
import { insertProductTool } from "../tools/insertProduct";
import { fallbackTool } from "../tools/fallback";
import { callModel } from "./modelRegistry";

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
