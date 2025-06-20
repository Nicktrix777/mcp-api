import { interpretWithGemini } from "../lib/gemini";
import { interpretWithOpenAI } from "../lib/openai"; 

const activeModel = "gemini"; //TODO: make this dynamic based on config or env

export async function callModel(prompt: string) {
  if (activeModel === "gemini") {
    return await interpretWithGemini(prompt);
  } else if (activeModel === "openai") {
    return await interpretWithOpenAI(prompt);
  }
}
